---
templateKey: blog-post
title: Azure DevOps Dec4th New Features
date: 2018-12-21T14:01:00.000Z
description: Automatic Rollback? Awesome. YAML Build Definitions? Game changer.
  Talking about new features coming to Azure DevOps!
featuredpost: false
featuredimage: /img/blogimage.png
tags:
  - AzureDevOps
  - Pipeline
  - Build
  - Automation
---
Automatic Rollback? Awesome. YAML Build Definitions? Game changer.

![Azure DevOps Documentation Page](/img/blogimage.png "Azure DevOps Documentation")

I appreciate the push from Microsoft when you start creating a new Build Definition in a Azure DevOps project. If you prefer the UI configured widgets you might not be as excited as I am, but anyone interested in configuration as code would probably share my enthusiasm. The Build creator is immediately presented with available templates for YAML builds. The old Build Definition tasks are all still available, but as you grow and take on more Builds or just want your Build changes to be tracked like the rest of your code base you’ll appreciate what YAML Builds bring to the table.

This new addition to the Post-Deployment conditions is also really exciting. Automatic rollback to your previous successful deployment if the current deployment fails. As embarrassing as this might sound, I’ve had to document how to find the last successful deployment to revert back to in case of a failed deployment. Thankfully, with an automated (and hopefully easily customizable) rollback process.

Great work Azure DevOps team! Can’t wait for YAML Release Definitions!