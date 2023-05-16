# edumeet-management-client
This is the management client for the edumeet management server.

## Manual installation (build)
Installation example is based on Debian/Ubuntu Linux operating system.
1. Install [NodeJS (v18.x)](https://github.com/nodesource/distributions) and [Yarn ](https://classic.yarnpkg.com/en/docs/install#debian-stable) package manager 
- NodeJS (v18.x) [Debian/Ubuntu](https://github.com/nodesource/distributions#deb)
```bash
# Using Ubuntu
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Using Debian, as root
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
```
- Yarn package manager:
```bash
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install yarn
```
2. Install all required dependencies
```bash
sudo apt update && sudo apt install -y curl git python python3-pip build-essential redis openssl libssl-dev pkg-config
```	
3. Clone eduMEET git repository
```bash
git clone https://github.com/edumeet/edumeet-management-client.git
cd edumeet-management-client
```
3. Install and run 
```bash
yarn
yarn start
```
