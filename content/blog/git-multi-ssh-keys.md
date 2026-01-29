---
title: "Git Multi SSH Keys (Work & Personal)"
slug: git-multi-ssh-keys
date: 2026-01-29
description: "Learn how to setup multiple SSH keys for Git"
tags:
  - Tutorial
category: DEVELOPMENT
author:
  name: Fathur
---

# Git Multi SSH Keys (Work & Personal) — Quick Tutorial

If you juggle work and personal repos, one default key isn’t enough. This setup keeps identities separated and prevents the "permission denied" surprises.

## 1. Generate SSH Keys

### 1.1 Personal
```bash
ssh-keygen -t ed25519 -C "personal@email.com" -f ~/.ssh/id_ed25519_personal
````

### 1.2 Work

```bash
ssh-keygen -t ed25519 -C "work@company.com" -f ~/.ssh/id_ed25519_work
```

---

## 2. Add Public Keys to Git Provider

```bash
cat ~/.ssh/id_ed25519_personal.pub
cat ~/.ssh/id_ed25519_work.pub
```

Quickly copy to clipboard (macOS):

```bash
pbcopy < ~/.ssh/id_ed25519_personal.pub
pbcopy < ~/.ssh/id_ed25519_work.pub
```

Add each key to:

* GitHub / GitLab / Bitbucket → **SSH Keys**

---

## 3. Configure `~/.ssh/config`

Quick edit with nano:

```bash
nano ~/.ssh/config
```

```ssh
# Personal
Host github.com-personal
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_personal
  IdentitiesOnly yes

# Work
Host github.com-work
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_work
  IdentitiesOnly yes
```

---

## 4. Test SSH Identity

```bash
ssh -T git@github.com-personal
ssh -T git@github.com-work
```

---

## 5. Clone Repo Using Correct Identity

### 5.1 Personal

```bash
git clone git@github.com-personal:username/repo.git
```

### 5.2 Work

```bash
git clone git@github.com-work:company/repo.git
```

---

## 6. Add / Fix Remote for Existing Repo

### 6.1 Set Personal Remote

```bash
git remote set-url origin git@github.com-personal:username/repo.git
```

### 6.2 Set Work Remote

```bash
git remote set-url origin git@github.com-work:company/repo.git
```

Verify:

```bash
git remote -v
```

---

## 7. Set Git Identity Per Repo

### 7.1 Personal

```bash
git config user.name "Your Name"
git config user.email "personal@email.com"
```

### 7.2 Work

```bash
git config user.name "Your Work Name"
git config user.email "work@company.com"
```

---

## 8. Verify Which Key Is Used (Debug)

```bash
GIT_SSH_COMMAND="ssh -v" git fetch origin
```

Look for:

```
Offering public key: ~/.ssh/id_ed25519_personal
```

---

## 9. Common Errors

### 9.1 Permission denied (publickey)

* SSH key not added to provider
* Wrong `Host` used in remote URL
* `IdentityFile` mismatch
