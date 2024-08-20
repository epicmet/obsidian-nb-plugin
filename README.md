# Obsidian `nb` plugin

> [!Warning]
>
> This plugin is in early stages, Backup you vault and make sure that you know EXACTLY what you're doing.

This is a [`nb`](https://github.com/xwmx/nb) wrapper for Obsidian.

## Installation

> [!IMPORTANT]
>
> Make sure you have `nb` up and running before attempting to enable this plugin.

You need to put the content of the `dist` directory inside your vault's plugins directory.

For example, using [`degit`](https://github.com/Rich-Harris/degit) it looks something like this:

```sh
npx degit \
  epicmet/obsidian-nb-plugin/dist \
  <PATH_TO_YOUR_VAULT>/.obsidian/plugins/obsidian-nb-pluglin # Modify this line
```

After putting it in the right place, reload community plugins from within Obsidian and enable the plugin.

> [!IMPORTANT]
>
> Since you are using `nb` and Obsidian together, you are essentially syncing the `.obsidian` directory which includes your vault's settings and plugins!
>
> I recommend adding such lines to the root `.gitignore` of the `nb` notebook
>
> ```
> .obsidian/plugins/
> .obsidian/workspace.json
> ```

### Why this plugins is not published to Obsidian's community plugins?

It's not registered as a standard community plugin within Obsidian because it's intended for developer use only.
