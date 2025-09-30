# SelfCore

Self-hostable web terminal like SSHX.io

---

## Features
- Browser-based terminal like SSHX
- Runs isolated bash sessions in Docker containers
- Generates unique session links
- Works with your DuckDNS domain (`selfcorex.duckdns.org`)
- Easy to install on any VPS

---

## Requirements
- VPS with a public IP
- Docker & Docker Compose installed
- Ports 5173 (frontend) and 3001 (backend) open
- DuckDNS subdomain configured (optional, for permanent links)

---

## Install
```bash
git clone https://github.com/tejasprogaming1713/SelfCore.git
cd SelfCore
chmod +x install.sh
./install.sh

After installation, open your browser:

http://selfcorex.duckdns.org:5173/?id=<session-id>

Each session will have a unique link.


---
