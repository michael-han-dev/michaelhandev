import { permanentRedirect } from 'next/navigation';

export default function AiHomePage() {
  permanentRedirect('/llms.txt');
}
