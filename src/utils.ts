import { DataAdapter, FileSystemAdapter } from "obsidian";

export function hasFileSystemAdaptor(
  adapter: DataAdapter,
): adapter is FileSystemAdapter {
  return adapter instanceof FileSystemAdapter;
}
