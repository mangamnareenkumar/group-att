import { promises as fs } from 'fs';
import path from 'path';

const GROUPS_FILE = path.join(process.cwd(), 'data', 'groups.json');

async function ensureDataDir() {
  try {
    await fs.mkdir(path.dirname(GROUPS_FILE), { recursive: true });
  } catch (error) {
    // Directory already exists
  }
}

export async function readGroups() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(GROUPS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

export async function writeGroups(groups) {
  try {
    await ensureDataDir();
    await fs.writeFile(GROUPS_FILE, JSON.stringify(groups, null, 2));
  } catch (error) {
    throw new Error('Failed to save groups data');
  }
}