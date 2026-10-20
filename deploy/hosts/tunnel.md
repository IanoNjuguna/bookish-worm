# Tunnels and Access, per host

One tunnel per host, so a compromised or misconfigured box cannot publish another
host's hostnames. Nothing listens publicly; cloudflared dials out from the box.

## 1. Create the tunnel (Cloudflare dashboard or CLI)

```bash
cloudflared tunnel login                       # once, in a browser, per account
cloudflared tunnel create doba-admin           # -> writes ~/.cloudflared/<id>.json
cloudflared tunnel route dns doba-admin admin.doba.world
```

Repeat with different names and hostnames:

    doba-admin     admin.doba.world
    doba-app       app.doba.world, studio.doba.world
    doba-api       api.doba.world

## 2. Point each host at its tunnel

On the box, install the service with the **token** form; it writes its own unit and
survives reboots:

```bash
sudo cloudflared service install eyJhIjoi...   # token from the tunnel page
sudo systemctl enable --now cloudflared
```

Then the ingress map. On the admin host, `/etc/cloudflared/config.yml`:

```yaml
tunnel: <tunnel-id>
credentials-file: /etc/cloudflared/<tunnel-id>.json
ingress:
  - hostname: admin.doba.world
    service: http://127.0.0.1:3100
  - service: http_status:404
```

Two hostnames on the app host, same tunnel:

```yaml
ingress:
  - hostname: app.doba.world
    service: http://127.0.0.1:3200
  - hostname: studio.doba.world
    service: http://127.0.0.1:3300
  - service: http_status:404
```

`sudo systemctl restart cloudflared` after editing.

## 3. Access, on the admin hostname only

Zero Trust → Access → Applications → Add a self-hosted application:

    Name           doba admin
    Domain         admin.doba.world
    Session        24h
    Policy         Allow · Emails · you@yourdomain
    Authentication Google or one-time PIN

Copy from the application:

    CF_ACCESS_TEAM_DOMAIN   https://<team>.cloudflareaccess.com
    CF_ACCESS_AUD           the Application Audience tag

Both go into `/srv/bookish-worm/shared/admin.env`:

```
CORE_API_URL=https://app.doba.world/api-backend
ADMIN_API_KEY=<same value core-api holds>
CF_ACCESS_TEAM_DOMAIN=https://<team>.cloudflareaccess.com
CF_ACCESS_AUD=<aud>
```

The app also verifies the JWT itself, so `*.vercel.app` or a leaked hostname is not
a way around the policy.

## 4. Prove it, from outside

```bash
# unauthenticated: Access should challenge, and the app should 403 if it ever gets through
curl -s -o /dev/null -w "%{http_code}\n" https://admin.doba.world/

# with an Access cookie/token, expect 200
curl -s -H "Cf-Access-Jwt-Assertion: $TOKEN" -o /dev/null -w "%{http_code}\n" https://admin.doba.world/

# and no public port on the box itself
nmap -Pn -p 22,80,443,3100 <public-ip>     # all filtered
```

The last one matters: if a security group rule was left open, the tunnel is theatre.
