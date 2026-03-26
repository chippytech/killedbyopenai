import { FC } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

// Import Styled Components
import { FooterContainer, FlexWrap } from 'components/Footer/Footer.atoms';
import { PressCoverage } from 'components';
import Link from 'next/link';

const SocialLink: FC<{ url: string; imgSrc: string; altText: string }> = ({
    url,
    imgSrc,
    altText,
}) => {
    return (
        <Link href={url} passHref>
            <a
                css={{
                    border: 'none',
                }}
                target='_blank'
                rel='noopener noreferrer'
            >
                <img
                    css={{
                        width: '24px',
                        height: '24px',
                    }}
                    width='24px'
                    height='24px'
                    src={imgSrc}
                    alt={altText}
                />
            </a>
        </Link>
    );
};

const CopyNotice = styled.div(() => css({
    fontSize: '0.75em',
    margin: '30px 0 20px 0',
    textAlign: 'center',
}));


const Title = styled.div(() => css({
    color: '#fafafa',
    fontSize: '2.5em',
    fontWeight: 'lighter',
}));

const FooterTitle = styled.div(() => css({
    alignItems: 'center',
    display: 'flex',
    justifyinit: 'center',
    paddingBottom: '20px',
}));

const SocialWrapper = styled.div(() => css({
    display: 'flex',
    justifyContent: 'center',
    padding: '15px 0',

    ['a']: {
        display: 'block',
        margin: '0 10px',
    },
}));

const Footer = () => (
    <>
        <PressCoverage />
        <FooterContainer>
            <FlexWrap>
                <FooterTitle>
                    <div css={{
                        marginRight: '10px',
                    }}>
                        {/* Swapped to a generic tombstone or your logo asset */}
                        <img height="60px" width="60px" src='https://static.killedbygoogle.com/com/tombstone-alt.svg' alt="Tombstone" />
                    </div>
                    <Title>Killed by OpenAI</Title>
                </FooterTitle>
                <div>
                    <p>
                        Killed by OpenAI is the OpenAI graveyard; a free and open source
                        list of discontinued OpenAI models, services, and APIs.
                        We aim to be a source of factual information about the history
                        surrounding OpenAI&apos;s dead projects.
                    </p>
                    <p>
                        <a
                            href="https://github.com/chippytech/killedbyopenai/graphs/contributors"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Contributors
                        </a>
                        &nbsp;help research and maintain the information about 
                        deprecated models and sudden API sunsets. You can join the
                        discussion on&nbsp;
                        <a href="https://github.com/chippytech/killedbyopenai">GitHub</a>. A project
                        by&nbsp;
                        <a
                            href="https://chippytime.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            ChippyTime
                        </a>
                        .
                    </p>
                    <p>
                        Press inquiries and compute-related complaints?
                        <br />
                        Send an email to&nbsp;
                        <a href="mailto:hello@chippytime.com">
                            hello@chippytime.com
                        </a>
                        .
                    </p>
                </div>
                <CopyNotice>
                    <a href="https://github.com/chippytech/killedbyopenai/blob/main/LICENSE">
                        &copy; 2026 ChippyTime Limited Group.
                    </a>
                </CopyNotice>
                <SocialWrapper>
                    <SocialLink
                        url="https://github.com/chippytech/killedbyopenai"
                        altText="GitHub"
                        imgSrc='https://static.killedbygoogle.com/com/github.svg'
                    />
                </SocialWrapper>
            </FlexWrap>
        </FooterContainer>
    </>
);

export default Footer;
