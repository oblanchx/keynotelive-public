Keynote Live - high performance news feed system
===========

MongoDB installation process
sudo pacman -S mongodb
sudo mkdir -p /data/db/
sudo chown `id -u` /data/db
sudo systemctl enable mongodb
sudo systemctl start mongodb
mongo
