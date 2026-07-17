import { GetStaticProps } from 'next';
import Head from 'next/head';
import slugify from 'slugify';

// Data
import graveyard from 'graveyard.json';

// Components
import Header from 'components/Header';
import App from 'components/App';
import Footer from 'components/Footer';
import { ProductWithSlug } from 'types/Product';

const HomePage: React.FC<{ items: ProductWithSlug[] }> = ({ items }) => {

    return (
        <>
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5" />
                <title>Killed by OpenAI — An Archive of Retired AI Products</title>
                <meta name="description" content="An independent archive documenting products, models, APIs, services, and features retired by OpenAI." />
                <link rel="shortcut icon" href="/favicon.png" />
                <link rel="canonical" href="https://killedbyopenai.com" />
                <meta name="theme-color" content="#f2f0e9" />
                <meta property="og:title" content="Killed by OpenAI — An Archive of Retired AI Products" />
                <meta property="og:description" content="An independent archive documenting products, models, APIs, services, and features retired by OpenAI." />
                <meta property="og:url" content="https://killedbyopenai.com" />
                <meta property="og:site_name" content="Killed by OpenAI" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://killedbyopenai.com/social/card.png" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Killed by OpenAI — An Archive of Retired AI Products" />
                <meta name="twitter:description" content="An independent archive documenting products, models, APIs, services, and features retired by OpenAI." />
                <meta name="twitter:image" content="https://killedbyopenai.com/social/card-twitter.png" />
            </Head>
            <Header />
            <App items={items} />
            <Footer />
        </>
    );
}
export default HomePage;

export const getStaticProps: GetStaticProps = async (_context) => {

    slugify.extend({
        '+': '-plus',
        '@': '-at',
    });

    const processed = graveyard.map((item) => ({
        ...item,
        slug: slugify(item.name, {
            lower: true,
        })
    })).sort((a, b) => (new Date(b.dateClose)).getTime() - (new Date(a.dateClose)).getTime());

    return {
        props: {
            items: processed
        }
    }
}
