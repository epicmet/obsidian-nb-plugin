# Obsidian `nb` plugin

> **Warning**
>
> This plugin is in early stages, Backup you vault and make sure that you know EXACTLY what you're doing.

This is a [`nb`](https://github.com/xwmx/nb) wrapper for Obsidian.

## Installation

Make sure you have `nb` up and running. (Refer to the [documentation](https://github.com/xwmx/nb) if needed).

Then clone the built plugin into your vault.

```sh
npx degit \
  epicmet/obsidian-nb-plugin/dist \
  <PATH_TO_YOUR_VAULT>/.obsidian/plugins/obsidian-nb-pluglin # Modify this line
```

And then reload community plugins from within Obsidian and enable the plugin.

### Why not Obsidian's community plugins section?

It's not registered as a standard community plugin within Obsidian because it's intended for developer use only.
