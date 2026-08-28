import { describe, it, expect, beforeEach } from 'vitest';
import {
  localWorkspace,
  globalWorkspace,
  localResolve,
  globalResolve,
  setWorkspaces,
  getWorkspaces
} from 'balm-core';
import path from 'node:path';

describe('Workspace Utility Subsystem', () => {
  beforeEach(() => {
    setWorkspaces(process.cwd(), path.resolve(process.cwd(), '..'));
  });

  it('should return default local and global workspaces', () => {
    const currentCwd = process.cwd();
    expect(localWorkspace()).toBe(currentCwd);
    expect(globalWorkspace()).toBe(path.resolve(currentCwd, '..'));
  });

  it('should resolve sub paths relative to local and global workspaces', () => {
    const currentCwd = process.cwd();
    expect(localWorkspace('src/styles')).toBe(path.join(currentCwd, 'src/styles'));
    expect(globalWorkspace('shared/styles')).toBe(path.join(path.resolve(currentCwd, '..'), 'shared/styles'));
  });

  it('should support localResolve and globalResolve aliases', () => {
    const currentCwd = process.cwd();
    expect(localResolve('src')).toBe(path.join(currentCwd, 'src'));
    expect(globalResolve('lib')).toBe(path.join(path.resolve(currentCwd, '..'), 'lib'));
  });

  it('should dynamically update workspaces with setWorkspaces', () => {
    const customLocal = '/Users/test/projects/my-app';
    const customGlobal = '/Users/test/projects';

    setWorkspaces(customLocal, customGlobal);

    const workspaces = getWorkspaces();
    expect(workspaces.local).toBe(customLocal);
    expect(workspaces.global).toBe(customGlobal);

    expect(localWorkspace('src/components')).toBe(path.join(customLocal, 'src/components'));
    expect(globalWorkspace('packages/shared')).toBe(path.join(customGlobal, 'packages/shared'));
  });
});
