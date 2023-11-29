#!/bin/sh
set -e
su node
top
exec "$@"
