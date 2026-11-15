#!/usr/bin/env python3
import json, subprocess, re, urllib.request, datetime, os, base64, shutil, plistlib, binascii

def run(cmd):
    try:
        return subprocess.check_output(
            cmd, shell=True, text=True, stderr=subprocess.DEVNULL, timeout=5
        ).strip()
    except Exception:
        return ""

def num(pattern, text, default=0):
    m = re.search(pattern, text, re.I)
    return float(m.group(1)) if m else default

# CPU load and logical core-equivalent usage.
top = run("top -l 1 -n 0")
cpu_match = re.search(r"CPU usage:\s*([\d.]+)%\s*user,\s*([\d.]+)%\s*sys", top)
if cpu_match:
    cpu_user = float(cpu_match.group(1))
    cpu_sys = float(cpu_match.group(2))
    cpu = max(0, min(100, round(cpu_user + cpu_sys)))
else:
    cpu_idle = num(r"([\d.]+)%\s*idle", top, default=100.0)
    cpu = max(0, min(100, round(100.0 - cpu_idle)))

cpu_cores_total = int(run("sysctl -n hw.logicalcpu") or os.cpu_count() or 0)
cpu_cores_used = round(cpu * cpu_cores_total / 100, 1) if cpu_cores_total else None

# Memory / RAM: Activity Monitor formula using vm_stat
vm = run("vm_stat")
page = int(num(r"page size of (\d+) bytes", vm, 16384))
pages = {}
for line in vm.splitlines():
    m = re.match(r"([^:]+):\s+([\d.]+)", line)
    if m:
        pages[m.group(1).strip()] = int(float(m.group(2).replace(".", "")))

app_mem = max(0, pages.get("Anonymous pages", 0) - pages.get("Pages purgeable", 0))
wired_mem = pages.get("Pages wired down", 0)
compressed_mem = pages.get("Pages occupied by compressor", 0)
used_pages = app_mem + wired_mem + compressed_mem
total_bytes = int(run("sysctl -n hw.memsize") or 0)
used_gb = round(used_pages * page / 1024**3, 1)
total_gb = round(total_bytes / 1024**3, 1)
mem_pct = max(0, min(100, round(used_gb / total_gb * 100))) if total_gb else 0

# Battery state and charge.
battery = run("pmset -g batt")
battery_pct = int(num(r"(\d+)%", battery, 0))
charging = "Charging" in battery or "AC Power" in battery
power = "Charging" if charging else ("On battery" if "Battery Power" in battery else "Power status unavailable")

# Find the Wi-Fi and active network interfaces.
ports = run("networksetup -listallhardwareports")
wifi_if = ""
for block in re.split(r"Hardware Port: ", ports):
    if block.startswith(("Wi-Fi", "AirPort")):
        match = re.search(r"Device:\s*(\S+)", block)
        if match:
            wifi_if = match.group(1)
            break

interfaces = run("ifconfig -l").split() or ["en0"]
interface_info = {}
def get_interface_info(device):
    if device not in interface_info:
        interface_info[device] = run(f"ifconfig {device}")
    return interface_info[device]

if not wifi_if and "en0" in interfaces:
    wifi_if = "en0"
if not wifi_if:
    for device in interfaces:
        if re.search(r"type: Wi-Fi", get_interface_info(device), re.I):
            wifi_if = device
            break
if not wifi_if and "en0" in interfaces:
    wifi_if = "en0"

route = run("route -n get default")
route_match = re.search(r"interface:\s*(\S+)", route)
iface = route_match.group(1) if route_match else wifi_if
def get_wifi_ssid(interface="en0"):
    # 1. Extract unredacted SSID_STR from scutil AirPort CachedScanRecord (works on macOS Sonoma / Sequoia)
    try:
        sc_out = subprocess.check_output(
            ["scutil"],
            input=f"show State:/Network/Interface/{interface}/AirPort\n",
            text=True, stderr=subprocess.DEVNULL, timeout=2
        )
        m = re.search(r"CachedScanRecord\s*:\s*<data>\s*0x([0-9a-fA-F]+)", sc_out)
        if m:
            raw_bytes = binascii.unhexlify(m.group(1))
            plist = plistlib.loads(raw_bytes)
            objects = plist.get("$objects", [])
            if "SSID_STR" in objects:
                ssid_key_idx = objects.index("SSID_STR")
                for obj in objects:
                    if isinstance(obj, dict) and "NS.keys" in obj and "NS.objects" in obj:
                        for k, v in zip(obj["NS.keys"], obj["NS.objects"]):
                            k_idx = getattr(k, "data", k)
                            v_idx = getattr(v, "data", v)
                            if k_idx == ssid_key_idx and isinstance(v_idx, int) and v_idx < len(objects):
                                val = objects[v_idx]
                                if isinstance(val, str) and val.strip() and val.lower() != "<redacted>":
                                    return val.strip()
            # Secondary check matching raw bytes against preferred networks
            pref_out = subprocess.check_output(
                ["networksetup", "-listpreferredwirelessnetworks", interface],
                text=True, stderr=subprocess.DEVNULL, timeout=2
            )
            for line in pref_out.splitlines()[1:]:
                cand = line.strip()
                if cand and cand.encode("utf-8") in raw_bytes:
                    return cand
    except Exception:
        pass

    # 2. networksetup -getairportnetwork
    try:
        out = subprocess.check_output(
            ["networksetup", "-getairportnetwork", interface],
            text=True, stderr=subprocess.DEVNULL, timeout=2
        ).strip()
        m = re.search(r"(?:Wi-Fi|AirPort)\s+Network:\s*(.+)", out, re.I)
        if m:
            val = m.group(1).strip()
            if val and val.lower() not in {"<redacted>", "you are not associated with an airport network."}:
                return val
    except Exception:
        pass

    # 3. ipconfig getsummary
    try:
        out = subprocess.check_output(
            ["ipconfig", "getsummary", interface],
            text=True, stderr=subprocess.DEVNULL, timeout=2
        )
        m = re.search(r"(?im)^\s*SSID\s*:\s*(.+)$", out)
        if m:
            val = m.group(1).strip()
            if val and val.lower() not in {"<redacted>", "(null)", "unknown"}:
                return val
    except Exception:
        pass

    # 4. Fallback: top preferred wireless network
    try:
        pref_out = subprocess.check_output(
            ["networksetup", "-listpreferredwirelessnetworks", interface],
            text=True, stderr=subprocess.DEVNULL, timeout=2
        )
        lines = [line.strip() for line in pref_out.splitlines()[1:] if line.strip()]
        if lines:
            return lines[0]
    except Exception:
        pass

    return ""

ssid = get_wifi_ssid(wifi_if) if wifi_if else ""
wifi_connected = bool(ssid)

# Local IPv4 address from the active route.
ip_iface = iface or wifi_if
ip = run(f"ipconfig getifaddr {ip_iface}") if ip_iface else ""
if not ip and ip_iface:
    ip_match = re.search(r"(?m)^\s*inet\s+([0-9.]+)", get_interface_info(ip_iface))
    if ip_match and not ip_match.group(1).startswith("127."):
        ip = ip_match.group(1)

# Bluetooth power and connected device name/battery.
bt_data = run("system_profiler SPBluetoothDataType")
bt_power = "Unavailable"
if re.search(r"(?:State|Bluetooth Power):\s*On\b", bt_data, re.I):
    bt_power = "On"
elif re.search(r"(?:State|Bluetooth Power):\s*Off\b", bt_data, re.I):
    bt_power = "Off"

bt_devices = []
lines = bt_data.splitlines()
property_labels = ("Connected", "Address", "Minor Type", "Major Type", "Services", "Vendor", "Battery", "Firmware", "Product ID")

for i, line in enumerate(lines):
    if line.strip().lower() != "connected:":
        continue
    section_indent = len(line) - len(line.lstrip())
    for j in range(i + 1, len(lines)):
        child = lines[j]
        stripped = child.strip()
        if not stripped:
            continue
        indent = len(child) - len(child.lstrip())
        if indent <= section_indent:
            break
        if stripped.endswith(":") and not stripped.startswith(property_labels):
            name = stripped[:-1].strip()
            device_indent = indent
            detail_lines = []
            for detail in lines[j + 1:min(len(lines), j + 16)]:
                detail_text = detail.strip()
                detail_indent = len(detail) - len(detail.lstrip())
                if detail_text and detail_indent <= device_indent:
                    break
                detail_lines.append(detail_text)
            details = "\n".join(detail_lines)
            battery_match = re.search(r"(?:Battery Level|Battery):.*?(\d{1,3})%", details, re.I | re.S)
            bt_devices.append(name + (f" {battery_match.group(1)}%" if battery_match else ""))

for i, line in enumerate(lines):
    if re.search(r"Connected:\s*Yes", line, re.I):
        for j in range(i - 1, max(-1, i - 6), -1):
            candidate = lines[j].strip().rstrip(":")
            if candidate and not candidate.startswith(property_labels):
                details = "\n".join(lines[i:min(len(lines), i + 12)])
                battery_match = re.search(r"(?:Battery Level|Battery):.*?(\d{1,3})%", details, re.I | re.S)
                bt_devices.append(candidate + (f" {battery_match.group(1)}%" if battery_match else ""))
                break
bt_devices = list(dict.fromkeys(bt_devices))
bt_label = ", ".join(bt_devices[:1]) if bt_devices else ("No device" if bt_power == "On" else "Unavailable")

# Interface byte counters provide system-wide download/upload rates.
def interface_counters(device):
    if not device:
        return None
    output = run("netstat -ibn")
    for line in output.splitlines():
        fields = line.split()
        if len(fields) >= 10 and fields[0] == device and (fields[2] == "Link" or fields[2].startswith("<Link#")):
            try:
                return int(fields[6]), int(fields[9])
            except (ValueError, IndexError):
                continue
    return None

def format_speed(value):
    if value is None:
        return "—"
    if value >= 1024 * 1024:
        return f"{value / (1024 * 1024):.1f} MB/s"
    return f"{round(value / 1024)} KB/s"

now = interface_counters(iface)
down_bps = up_bps = None
counter_path = "/tmp/cyberpunk-dashboard-net.json"
if now:
    try:
        with open(counter_path) as f:
            previous = json.load(f)
        if previous.get("iface") == iface:
            elapsed = max(1, datetime.datetime.now().timestamp() - previous["time"])
            down_bps = max(0, now[0] - previous["rx"]) / elapsed
            up_bps = max(0, now[1] - previous["tx"]) / elapsed
    except Exception:
        down_bps = up_bps = 0
    try:
        with open(counter_path, "w") as f:
            json.dump({"time": datetime.datetime.now().timestamp(), "rx": now[0], "tx": now[1], "iface": iface}, f)
    except Exception:
        pass

down = format_speed(down_bps)
up = format_speed(up_bps)

# Disk usage for the active data volume.
# On macOS, root / is a read-only APFS system snapshot (usually 5% / 12GB used).
# The user's actual files, apps, and storage live on /System/Volumes/Data.
try:
    data_path = "/System/Volumes/Data" if os.path.exists("/System/Volumes/Data") else os.path.expanduser("~")
    usage = shutil.disk_usage(data_path)
    disk_size = round(usage.total / 1024**3)
    disk_used = round(usage.used / 1024**3)
    disk_pct = max(0, min(100, round((usage.used / usage.total) * 100))) if usage.total else 0
except Exception:
    disk = run("df -k /System/Volumes/Data 2>/dev/null || df -k ~ 2>/dev/null || df -k /")
    disk_lines = disk.splitlines()
    disk_pct = int(num(r"(\d+)%", disk_lines[-1], 0)) if len(disk_lines) > 1 else 0
    disk_size = round(int(disk_lines[-1].split()[1]) / 1024**2) if len(disk_lines) > 1 else 0
    disk_used = round(int(disk_lines[-1].split()[2]) / 1024**2) if len(disk_lines) > 1 else 0

# Weather via Open-Meteo (free, no API key), with 15-minute caching for speed and reliability.
weather_cache_file = "/tmp/cyberpunk-dashboard-weather-v2.json"
weather = []
weather_cached = False

try:
    if os.path.exists(weather_cache_file):
        with open(weather_cache_file) as wf:
            cached_data = json.load(wf)
            if cached_data.get("timestamp") and (datetime.datetime.now().timestamp() - cached_data["timestamp"] < 900):
                if isinstance(cached_data.get("weather"), list) and cached_data["weather"]:
                    weather = cached_data["weather"]
                    weather_cached = True
except Exception:
    pass

if not weather_cached:
    places = [
        ("Eluru", 16.7107, 81.0952),
        ("Tekkali", 18.6056, 84.2355),
        ("Gampalagudem", 16.9833, 80.5167),
        ("Navi Mumbai", 19.0330, 73.0297),
        ("Vijayawada", 16.5062, 80.6480),
        ("Hyderabad", 17.3850, 78.4867),
    ]
    for name, lat, lon in places:
        try:
            url = ("https://api.open-meteo.com/v1/forecast?"
                   f"latitude={lat}&longitude={lon}&current=temperature_2m,"
                   "relative_humidity_2m,apparent_temperature,precipitation,"
                   "weather_code,wind_speed_10m&daily=temperature_2m_max,"
                   "temperature_2m_min,weather_code,precipitation_probability_max"
                   "&forecast_days=1&timezone=auto")
            req = urllib.request.Request(url, headers={"User-Agent": "CyberpunkDesktop/1.0"})
            with urllib.request.urlopen(req, timeout=5) as r:
                forecast = json.load(r)
            cur = forecast["current"]
            daily = forecast["daily"]
            code = cur.get("weather_code", 0)
            icon = "☀"
            condition = "Sunny"
            if code in [1]: icon, condition = "🌤", "Mostly clear"
            if code in [2, 3]: icon, condition = "☁", "Cloudy"
            if code in [45, 48]: icon, condition = "≋", "Foggy"
            if code in [51, 53, 55, 56, 57]: icon, condition = "☂", "Drizzle"
            if code in [61, 63, 65, 66, 67, 80, 81, 82]: icon, condition = "☂", "Rain"
            if code in [71, 73, 75, 77, 85, 86]: icon, condition = "❄", "Snow"
            if code in [95, 96, 99]: icon, condition = "⚡", "Thunderstorm"
            weather.append({
                "name": name, "temp": round(cur["temperature_2m"]),
                "high": round(daily["temperature_2m_max"][0]),
                "low": round(daily["temperature_2m_min"][0]),
                "condition": condition,
                "rain": daily["precipitation_probability_max"][0], "icon": icon
            })
        except Exception:
            weather.append({"name": name, "temp": "--", "high": "--", "low": "--",
                            "condition": "Unavailable", "rain": "--", "icon": "☁"})
    if any(w.get("temp") != "--" for w in weather):
        try:
            with open(weather_cache_file, "w") as wf:
                json.dump({"timestamp": datetime.datetime.now().timestamp(), "weather": weather}, wf)
        except Exception:
            pass

# Apple GPU utilization and core count from IOAccelerator performance statistics.
gpu_info = run("ioreg -r -c IOAccelerator -d 2")
gpu_value = num(r'"Device Utilization %"\s*=\s*([\d.]+)', gpu_info, None)
gpu_pct = round(gpu_value) if gpu_value is not None else 0
gpu_core_count = int(num(r'"gpu-core-count"\s*=\s*(\d+)', gpu_info, 0))
gpu_cores_used = round(gpu_pct * gpu_core_count / 100, 1) if gpu_pct is not None and gpu_core_count else 0.0


# Apple Mail Integration
def format_mail_date(dt_str):
    try:
        clean_dt = dt_str.replace("\u202f", " ").replace("\xa0", " ").strip()
        t_match = re.search(r"(\d{1,2}:\d{2})(?::\d{2})?\s*([AP]M)", clean_dt, re.I)
        time_part = f"{t_match.group(1)} {t_match.group(2).upper()}" if t_match else ""
        
        now = datetime.datetime.now()
        d_match = re.search(r"(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})", clean_dt)
        if d_match:
            day = int(d_match.group(1))
            month_str = d_match.group(2)[:3]
            year = int(d_match.group(3))
            if day == now.day and year == now.year:
                return time_part or f"{day} {month_str}"
            elif day == (now - datetime.timedelta(days=1)).day and year == now.year:
                return "Yesterday"
            else:
                return f"{day} {month_str}"
        return time_part or clean_dt
    except Exception:
        return dt_str

def is_job_email(sender, email, subject):
    text = f"{sender} {email} {subject}".lower()
    negatives = [
        "credit card", "debit card", "statement", "emi", "bank", "otp", "invoice", "bill",
        "flight", "itinerary", "booking", "boarding pass", "swiggy", "zomato", "uber", "ola",
        "amazon order", "flipkart", "cashback", "recharge", "security alert", "password reset",
        "verification code", "netflix", "prime video", "spotify", "subscription renewed",
        "order confirmed", "delivered", "shipping update", "dispatched"
    ]
    if any(neg in text for neg in negatives):
        return False

    job_keywords = [
        "recruiter", "recruitment", "recruiting", "talent acquisition", "staffing",
        "hiring", "headhunter", "sourcer", "careers", "career opportunity",
        "interview", "interview invitation", "shortlisted", "job opportunity",
        "job opening", "job application", "application received", "application status",
        "role of", "opening for", "position of", "candidate", "resume", "curriculum vitae",
        "offer letter", "assessment", "coding test", "coderpad", "hackerrank",
        "software engineer", "frontend", "backend", "full stack", "fullstack", "sde",
        "java developer", "python developer", "react developer", "web developer",
        "referred you", "invitation to apply", "job alert", "recommended job"
    ]
    if any(kw in text for kw in job_keywords):
        return True

    job_platforms = [
        "linkedin", "naukri", "indeed", "instahyre", "hirist", "cutshort", "glassdoor",
        "wellfound", "angellist", "greenhouse", "lever.co", "workday", "smartrecruiters",
        "ashbyhq", "ashby", "jobvite", "bamboohr", "workable", "hirect", "foundit", "monster"
    ]
    sender_lower = f"{sender} {email}".lower()
    if any(p in sender_lower for p in job_platforms):
        return True

    return False

def get_apple_mail():
    script = '''
    tell application "Mail"
      set unreadCnt to unread count of inbox
      set totalCnt to count of messages of inbox
      set maxCount to 30
      if totalCnt < maxCount then set maxCount to totalCnt
      set AppleScript's text item delimiters to "___MSG___"
      set outList to {}
      if maxCount > 0 then
        repeat with i from 1 to maxCount
          set m to message i of inbox
          set s to subject of m
          set sndr to sender of m
          set dt to (date received of m) as string
          set msgRead to read status of m
          set msgId to message id of m
          set end of outList to (sndr & "|||" & s & "|||" & dt & "|||" & (msgRead as string) & "|||" & msgId)
        end repeat
      end if
      return (unreadCnt as string) & "###" & (totalCnt as string) & "###" & (outList as string)
    end tell
    '''
    try:
        res = subprocess.check_output(["osascript", "-e", script], text=True, stderr=subprocess.DEVNULL, timeout=5).strip()
        parts = res.split("###")
        unread_count = int(parts[0]) if len(parts) > 0 and parts[0].isdigit() else 0
        total_count = int(parts[1]) if len(parts) > 1 and parts[1].isdigit() else 0
        raw_msgs = parts[2].split("___MSG___") if len(parts) > 2 and parts[2] else []
        
        messages = []
        for rm in raw_msgs:
            fields = rm.split("|||")
            if len(fields) >= 5:
                raw_sender = fields[0]
                sender_name = raw_sender
                sender_email = ""
                m = re.match(r"^(.*?)\s*<([^>]+)>$", raw_sender)
                if m:
                    sender_name = m.group(1).strip().strip('\"') or m.group(2)
                    sender_email = m.group(2).strip()
                
                subject = fields[1].strip() or "(No Subject)"
                date_str = fields[2].strip()
                is_read = fields[3].strip().lower() == "true"
                msg_id = fields[4].strip()
                is_job = is_job_email(sender_name, sender_email, subject)
                
                messages.append({
                    "id": msg_id,
                    "sender": sender_name,
                    "email": sender_email,
                    "subject": subject,
                    "date": format_mail_date(date_str),
                    "raw_date": date_str,
                    "is_read": is_read,
                    "is_job": is_job
                })
        
        unread_in_recent = sum(1 for m in messages if not m.get("is_read", True))
        unread_count = max(unread_count, unread_in_recent)
        jobs_count = sum(1 for m in messages if m.get("is_job", False))

        return {
            "connected": True,
            "unread_count": unread_count,
            "total_count": total_count,
            "jobs_count": jobs_count,
            "messages": messages
        }
    except Exception:
        return {
            "connected": False,
            "unread_count": 0,
            "total_count": 0,
            "jobs_count": 0,
            "messages": []
        }

mail_cache_file = "/tmp/cyberpunk_mail_cache.json"
mail_data = None
try:
    if os.path.exists(mail_cache_file):
        with open(mail_cache_file, "r") as mf:
            cached = json.load(mf)
            if datetime.datetime.now().timestamp() - cached.get("timestamp", 0) < 20:
                mail_data = cached.get("mail")
except Exception:
    pass

if not mail_data:
    mail_data = get_apple_mail()
    try:
        with open(mail_cache_file, "w") as mf:
            json.dump({"timestamp": datetime.datetime.now().timestamp(), "mail": mail_data}, mf)
    except Exception:
        pass

app_icons = {}
icon_dir = os.path.join(os.path.dirname(__file__), "icons", "optimized")
try:
    for filename in os.listdir(icon_dir):
        if filename.lower().endswith(".png") and filename != "chrome.png":
            with open(os.path.join(icon_dir, filename), "rb") as icon_file:
                app_icons[filename] = base64.b64encode(icon_file.read()).decode("ascii")
except OSError:
    pass

data = {
    "time": datetime.datetime.now().strftime("%I:%M"),
    "ampm": datetime.datetime.now().strftime("%p"),
    "date": datetime.datetime.now().strftime("%a, %d %b %Y"),
    "cpu": cpu, "cpu_cores_used": cpu_cores_used, "cpu_cores_total": cpu_cores_total,
    "memory": mem_pct, "used_gb": used_gb, "total_gb": total_gb,
    "battery": battery_pct, "power": power,
    "wifi": ssid, "wifi_connected": wifi_connected, "bluetooth": bt_label,
    "bluetooth_power": bt_power, "ip": ip, "down": down, "up": up,
    "disk": disk_pct, "disk_used": disk_used, "disk_size": disk_size,
    "weather": weather, "gpu": gpu_pct, "app_icons": app_icons,
    "gpu_cores_used": gpu_cores_used, "gpu_cores_total": gpu_core_count or None,
    "mail": mail_data
}
print(json.dumps(data))
