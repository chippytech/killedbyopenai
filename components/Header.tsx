import Link from 'next/link';
const repo = 'https://github.com/chippytech/killedbyopenai';
const issue = `${repo}/issues/new/choose`;

const Header = () => (
  <header className="site-header">
    <div className="page-shell header-inner">
      <Link href="/" passHref><a className="brand" aria-label="Killed by OpenAI home"><span className="brand-mark" aria-hidden="true" /><span>Killed by OpenAI</span></a></Link>
      <nav aria-label="Primary navigation"><a href="#archive">Archive</a><a href="#about">About</a><a href={issue}>Contribute</a><a href={repo} target="_blank" rel="noopener noreferrer" aria-label="GitHub repository for Killed by OpenAI">GitHub</a></nav>
    </div>
  </header>
);
export default Header;
