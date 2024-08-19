import * as ncp from "child_process";
import { promisify } from "util";
import {
  App,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  Platform,
} from "obsidian";

const exec = promisify(ncp.exec);

interface PluginSettings {
  runOnInterval: boolean;
  intervalInSecs: number;
}

const DEFAULT_SETTINGS: PluginSettings = {
  runOnInterval: false,
  intervalInSecs: 30,
};

const SYNC_CMD = ["nb", "sync"].join(" ");

export default class NBPlugin extends Plugin {
  settings: PluginSettings;
  statusBar: HTMLElement;
  intervalId: number | undefined;

  // TODO: Avoid parallel sync
  private async isRunning(query: string) {
    let platform = process.platform;
    let cmd = "";
    switch (platform) {
      case "win32":
        cmd = `tasklist`;
        break;
      case "darwin":
        cmd = `ps -ax | grep ${query}`;
        break;
      case "linux":
        cmd = `ps -A`;
        break;
      default:
        break;
    }
    const { stdout } = await exec(cmd);
    return stdout.toLowerCase().indexOf(query.toLowerCase()) > -1;
  }

  private async sync() {
    if (!Platform.isDesktop) {
      return new Notice(
        "The mobile is not supported yet! Use this plugin on desktop only for now!",
      );
    }

    new Notice("Started syncing");
    this.statusBar.setText("Syncing...");
    // TODO: Timeout & Abort signal
    const res = await exec(SYNC_CMD, {}).catch((err) => {
      new Notice("Could not sync! Checkout the logs");
      console.error(err);
      return null;
    });

    if (res) {
      new Notice("Sync complete!");
      this.statusBar.setText(
        `Last sync time: ${new Date().toLocaleString("en-GB")}`,
      );
    }
  }

  private addInterval() {
    if (this.settings.runOnInterval) {
      this.intervalId = window.setInterval(() => {
        console.info("Running `nb sync` interval time!");

        exec(["nb", "git", "status", "--porcelain"].join(" "))
          .then((shouldSync) => {
            if (shouldSync.stdout.length !== 0) {
              this.sync().then(() => console.log("Sync interval done!"));
            } else {
              console.info("Got a clean working directory! No need to sync!");
            }
          })
          .catch((err) => {
            console.error(`nb git error!`);
            console.error(err);
          });
      }, this.settings.intervalInSecs * 1000);

      this.registerInterval(this.intervalId);
    } else {
      window.clearInterval(this.intervalId);
    }
  }

  private loadSettingBasedThings() {
    this.addInterval();
  }

  async onload() {
    this.statusBar = this.addStatusBarItem();
    await this.loadSettings();
    console.info(
      `Initial load of nb plugin with: ${JSON.stringify(this.settings)}`,
    );

    this.addRibbonIcon("dice", "Run `nb sync`", async (_evt: MouseEvent) => {
      await this.sync();
    });

    this.addSettingTab(new SampleSettingTab(this.app, this));

    this.loadSettingBasedThings();
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
    this.loadSettingBasedThings();
  }
}

class SampleSettingTab extends PluginSettingTab {
  plugin: NBPlugin;

  constructor(app: App, plugin: NBPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Runing on interval")
      .setDesc("Running `nb sync` on an interval")
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.runOnInterval);
        toggle.onChange(async (checked) => {
          this.plugin.settings.runOnInterval = checked;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName("Interval time in seconds")
      .setDesc(
        "Running `nb sync` every x seconds. This only works if running on interval is active. (Don't put less than 30 secs)",
      )
      .addText((text) => {
        text.setValue(this.plugin.settings.intervalInSecs.toString());
        text.onChange(async (intervalInStr) => {
          const interval = parseInt(intervalInStr);
          this.plugin.settings.intervalInSecs = interval;
          await this.plugin.saveSettings();
        });
      });
  }
}
