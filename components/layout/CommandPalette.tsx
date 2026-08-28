'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from 'cmdk';
import { Globe, FolderOpen, FileText, Briefcase } from 'lucide-react';

export interface PaletteProject {
  slug: string;
  title: string;
  categories: string[];
}

const pageCommands = [
  { value: '/', label: 'Dashboard', icon: Globe },
  { value: '/projects', label: 'Projects', icon: FolderOpen },
  { value: '/notes', label: 'Notes', icon: FileText },
  { value: '/experience', label: 'Experience', icon: Briefcase },
];

export function CommandPalette({ projects = [] }: { projects?: PaletteProject[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages, projects, notes..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Pages">
          {pageCommands.map((cmd) => (
            <CommandItem
              key={cmd.value}
              value={cmd.label.toLowerCase()}
              onSelect={() => runCommand(cmd.value)}
            >
              <cmd.icon className="mr-2 h-4 w-4 text-zinc-500" />
              <span>{cmd.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Projects">
          {projects.map((project) => (
            <CommandItem
              key={project.slug}
              value={`${project.title.toLowerCase()} ${project.categories.join(' ')}`}
              onSelect={() => runCommand(`/projects/${project.slug}`)}
            >
              <FolderOpen className="mr-2 h-4 w-4 text-zinc-500" />
              <span>{project.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => runCommand('/notes')}>
            <FileText className="mr-2 h-4 w-4 text-zinc-500" />
            <span>Browse all notes</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand('/experience')}>
            <Briefcase className="mr-2 h-4 w-4 text-zinc-500" />
            <span>View experience</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
