const repo = 'https://github.com/chippytech/killedbyopenai';
const Footer = () => <footer className="site-footer"><div className="page-shell footer-inner"><div><strong>Killed by OpenAI</strong><p>An independent community archive.</p></div><nav aria-label="Footer navigation"><a href={repo}>GitHub</a><a href={`${repo}/issues/new/choose`}>Contribute</a><a href={`${repo}/blob/main/LICENSE`}>License</a></nav></div><div className="page-shell footer-bottom"><span>© {new Date().getFullYear()} Killed by OpenAI.</span><span>Not affiliated with OpenAI.</span></div></footer>;
export default Footer;
