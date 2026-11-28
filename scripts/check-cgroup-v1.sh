#!/bin/sh

if ! command -v docker >/dev/null 2>&1; then
  echo "Judge0 setup failed: Docker CLI is required." >&2
  exit 1
fi

cgroup_version=$(docker info --format '{{.CgroupVersion}}' 2>/dev/null)

if [ "$cgroup_version" = "1" ]; then
  exit 0
fi

cat >&2 <<'EOF'
Judge0 setup failed: Docker is using cgroup v2, but this Judge0 image requires cgroup v1.

Configure the Linux host to use cgroup v1, then reboot:

  sudo sh -c 'printf "\nGRUB_CMDLINE_LINUX=\"$GRUB_CMDLINE_LINUX systemd.unified_cgroup_hierarchy=0\"\n" >> /etc/default/grub'
  sudo update-grub
  sudo reboot

After rebooting, verify Docker reports cgroup v1:

  docker info --format '{{.CgroupVersion}}'

On Docker hosts using systemd, also configure /etc/docker/daemon.json with:

  {"exec-opts": ["native.cgroupdriver=cgroupfs"]}

Then restart Docker:

  sudo systemctl restart docker
EOF

exit 1
