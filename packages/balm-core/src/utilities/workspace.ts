import path from 'node:path';

export interface WorkspacePaths {
  local: string;
  global: string;
}

let currentLocalWorkspace: string = process.cwd();
let currentGlobalWorkspace: string = path.resolve(process.cwd(), '..');

export function setWorkspaces(local?: string, global?: string): void {
  if (local) {
    currentLocalWorkspace = path.resolve(local);
  }
  if (global) {
    currentGlobalWorkspace = path.resolve(global);
  } else if (local && !global) {
    currentGlobalWorkspace = path.resolve(currentLocalWorkspace, '..');
  }
}

export function getWorkspaces(): WorkspacePaths {
  return {
    local: currentLocalWorkspace,
    global: currentGlobalWorkspace
  };
}

export function localWorkspace(subPath: string = ''): string {
  return subPath ? path.resolve(currentLocalWorkspace, subPath) : currentLocalWorkspace;
}

export function globalWorkspace(subPath: string = ''): string {
  return subPath ? path.resolve(currentGlobalWorkspace, subPath) : currentGlobalWorkspace;
}

export const localResolve = localWorkspace;
export const globalResolve = globalWorkspace;
