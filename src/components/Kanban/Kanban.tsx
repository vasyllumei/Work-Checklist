import styles from './Kanban.module.css';
import { Layout } from '@/components/Layout/Layout';
import { Column } from 'src/components/Kanban/components/Column';
interface CardData {
  title: string;
  content: string;
  buttonState: 'Pending' | 'Updates' | 'Errors' | 'Done';
  image?: string;
  avatars?: string[];
}

export const Kanban = () => {
  const backlogCards: CardData[] = [
    {
      title: 'Option to "use local / server version" feature',
      content:
        "It usually displays this message when you close an unsaved page when you do it on purpose, and it's getting frustrated to see this every time.",
      buttonState: 'Updates',
      avatars: ['/member3.png', '/member1.png'],
    },
    {
      title: 'Add/modify your own CSS-Selectors',
      content: 'Website Design: The ability to add/modify your own CSS-Selectors like its done in Venus.',
      buttonState: 'Pending',
      image: '/imageColumn1.jpg',
      avatars: ['/member3.png', '/member1.png', '/member2.png'],
    },
    {
      title: 'Shortcode for templates to display correctly',
      content:
        'When you save some sections as a template and then paste a shortcode to a new page, the layout is broken, some styles are missing - in the editor.',
      buttonState: 'Errors',
      avatars: ['/member3.png'],
    },
  ];

  const inProgressCards: CardData[] = [
    {
      title: "General ideas to improve 'Edit' workflow",
      content:
        "Currently, I have a few templates in the Local Library and when I want to add them I'm always presented (by default).",
      buttonState: 'Pending',
      avatars: ['/member3.png', '/member1.png', '/member2.png'],
    },
    {
      title: 'Shortcode for templates to display correctly',
      content:
        'When you save some sections as a template and then paste a shortcode to a new page, the layout is broken, some styles are missing - in the editor.',
      buttonState: 'Updates',
      avatars: ['/member3.png'],
    },
    {
      title: '[UX Design] - Set the default Library tab',
      content:
        'I want to be able to set the default Library tab (or a way to remember the last active tab), especially when I already...',
      buttonState: 'Errors',
      image: '/imageColumn2.jpg',
      avatars: ['/member3.png', '/member1.png'],
    },
  ];

  const doneCards: CardData[] = [
    {
      title: 'Copy/Paste elements between pages',
      content: 'We can only copy/paste elements (or group of elements) in the same page, which is quite limited.',
      buttonState: 'Done',
      avatars: ['/member3.png'],
    },
    {
      title: 'Remove Extra DIV for each container added',
      content:
        "I still hope there won't have an extra div for each container we added. It should be something for better styling...",
      buttonState: 'Done',
      avatars: ['/member3.png', '/member1.png', '/member2.png'],
    },
    {
      title: 'Add Figma files for the Library design blocks',
      content:
        'I want to present my clients the Figma files first, so it would be great if you add those as well, more manual downloads...',
      buttonState: 'Done',
      avatars: ['/member3.png', '/member1.png'],
    },
  ];
  return (
    <Layout>
      <div className={styles.mainContainer}>
        <Column title="Backlog" cards={backlogCards} />
        <Column title="In progress" cards={inProgressCards} />
        <Column title="Done" cards={doneCards} />
      </div>
    </Layout>
  );
};
