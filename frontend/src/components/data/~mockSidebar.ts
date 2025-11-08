export type SidebarIconName = 'book' | 'paper' | 'play' | 'link' | 'calendar';

export type SidebarItemMock = {
  id: 'introduction' | 'material' | 'movie' | 'note' | 'reference' | 'submission';
  label: string;
  iconName: SidebarIconName;
};

export const mockSidebarItems: SidebarItemMock[] = [
  { id: 'introduction', label: 'Introduction', iconName: 'book' },
  { id: 'material', label: 'Material', iconName: 'paper' },
  { id: 'movie', label: 'Movie 1', iconName: 'play' },
  { id: 'note', label: 'Note for Assignment 1', iconName: 'paper' },
  { id: 'reference', label: 'Reference', iconName: 'link' },
  { id: 'submission', label: 'Submission 1', iconName: 'calendar' },
];
