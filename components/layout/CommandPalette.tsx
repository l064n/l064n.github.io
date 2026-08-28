'use client';

import { useEffect } from 'react';
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

export interface PaletteNote {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary?: string;
  /** Plain-text body excerpt for full-text search. */
  excerpt: string;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects?: PaletteProject[];
  notes?: PaletteNote[];
}

const pageCommands = [
  { value: '/', label: 'Dashboard', icon: Globe },
  { value: '/projects', label: 'Projects', icon: FolderOpen },
  { value: '/notes', label: 'Notes', icon: FileText },
  { value: '/experience', label: 'Experience', icon: Briefcase },
];

export function CommandPalette({
  open,
  onOpenChange,
  projects = [],
  notes = [],
}: CommandPaletteProps) {
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const runCommand = (url: string) => {
    onOpenChange(false);
    router.push(url);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
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

        <CommandGroup heading="Notes">
          {notes.map((note) => (
            <CommandItem
              key={note.slug}
              value={`${note.title} ${note.tags.join(' ')} ${note.summary ?? ''} ${note.excerpt}`.toLowerCase()}
              onSelect={() => runCommand(`/notes/${note.slug}`)}
            >
              <FileText className="mr-2 h-4 w-4 shrink-0 text-zinc-500" />
              <span className="truncate">{note.title}</span>
              <span className="ml-auto shrink-0 font-mono text-[10px] text-zinc-600">
                {note.date.slice(0, 7)}
              </span>
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
