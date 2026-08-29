# Windows + WSL Development Setup

Use Ubuntu in WSL for Git, Ruby, Rails, PostgreSQL, Node, npm, and Pi. Use VS Code's WSL extension so the editor and terminal operate on the same Linux files.

## 1. Open Ubuntu and install system packages

```bash
sudo apt update
sudo apt install -y git curl build-essential autoconf libssl-dev   libreadline-dev zlib1g-dev libyaml-dev libffi-dev libgmp-dev   libpq-dev postgresql postgresql-contrib
```

## 2. Install rbenv and Ruby 3.3.7

```bash
curl -fsSL https://github.com/rbenv/rbenv-installer/raw/HEAD/bin/rbenv-installer | bash
printf '
export PATH="$HOME/.rbenv/bin:$PATH"
eval "$(rbenv init - bash)"
' >> ~/.bashrc
source ~/.bashrc
rbenv install 3.3.7
rbenv global 3.3.7
gem install bundler
ruby --version
```

Expected Ruby: `3.3.7`.

## 3. Install Node 22 with nvm

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22
node --version
npm --version
```

## 4. Start PostgreSQL and create your local role

```bash
sudo service postgresql start
sudo -u postgres createuser -s "$USER"
```

If the role already exists, PostgreSQL will report that; continue.

## 5. Clone the repository inside WSL

Do not develop from `/mnt/c/...`. Keep the repository in the Linux filesystem:

```bash
mkdir -p ~/code
cd ~/code
git clone https://github.com/Code-School-of-Guam-Alumni/party-games-hub.git
cd party-games-hub
code .
```

Install the VS Code **WSL** extension if `code .` does not open a WSL-connected window.

## 6. Install and run the API

```bash
cd ~/code/party-games-hub/api
bundle install
bin/rails db:prepare
bin/rails test
bin/dev
```

Visit `http://127.0.0.1:43201/up`.

## 7. Install and run the web app

Open a second Ubuntu terminal:

```bash
cd ~/code/party-games-hub/web
npm install
npm run lint
npm run dev
```

Visit `http://127.0.0.1:43202`.

The page should report **Rails API connected** when both processes are running.

## 8. Verify Git and Pi

```bash
git --version
pi --version
```

Never paste provider API keys into WhatsApp, GitHub issues, source files, or commits. Store any Pi/provider credentials only in the location required by the Pi setup instructions.

## Common problems

### `rails` or `ruby` is the wrong version

```bash
source ~/.bashrc
rbenv global 3.3.7
rbenv rehash
```

### PostgreSQL connection error

```bash
sudo service postgresql start
sudo -u postgres createuser -s "$USER"
cd ~/code/party-games-hub/api
bin/rails db:prepare
```

### Web page shows starter catalog

Confirm Rails is running on port 43201, then refresh the browser.

### Files are slow or permissions behave strangely

Confirm the repository is under `~/code`, not `/mnt/c`.
