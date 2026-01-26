'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface MorphingSvgProps {
  theme?: string;
}

export function MorphingSvg({ theme }: MorphingSvgProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // Main container refs
  const scrollGroupRef = useRef<SVGGElement>(null);
  const cursorRef = useRef<SVGGElement>(null);

  // Tag group refs
  const navTagGroupRef = useRef<SVGGElement>(null);
  const heroTagGroupRef = useRef<SVGGElement>(null);
  const aboutTagGroupRef = useRef<SVGGElement>(null);
  const servicesTagGroupRef = useRef<SVGGElement>(null);
  const contactTagGroupRef = useRef<SVGGElement>(null);

  // UI group refs
  const navUiRef = useRef<SVGGElement>(null);
  const heroUiRef = useRef<SVGGElement>(null);
  const aboutUiRef = useRef<SVGGElement>(null);
  const servicesUiRef = useRef<SVGGElement>(null);
  const contactUiRef = useRef<SVGGElement>(null);

  // Interactive element refs
  const themeToggleRef = useRef<SVGGElement>(null);
  const sunIconRef = useRef<SVGGElement>(null);
  const moonIconRef = useRef<SVGGElement>(null);
  const heroHeadlineRef = useRef<SVGTextElement>(null);
  const heroSubtitleRef = useRef<SVGTextElement>(null);
  const servicesLinkRef = useRef<SVGTextElement>(null);
  const logoTextRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    
    const tagGroups = [navTagGroupRef, heroTagGroupRef, aboutTagGroupRef, servicesTagGroupRef, contactTagGroupRef];
    const uis = [navUiRef, heroUiRef, aboutUiRef, servicesUiRef, contactUiRef];
    
    const colors = {
        light: {
            bg: 'hsl(0 0% 100%)',
            uiBg: 'hsl(240 4.8% 95.9%)',
            uiStroke: 'hsl(240 5.9% 90%)',
            uiFillMuted: 'hsl(240 3.8% 46.1%)',
            uiFillPrimary: 'hsl(240 10% 3.9%)',
            uiTextMuted: 'hsl(240 3.8% 46.1%)',
            tagText: 'hsl(240 3.8% 46.1%)',
            primary: 'hsl(240 10% 3.9%)',
        },
        dark: {
            bg: 'hsl(240 10% 3.9%)',
            uiBg: 'hsl(240 3.7% 15.9%)',
            uiStroke: 'hsl(240 3.7% 15.9%)',
            uiFillMuted: 'hsl(240 5% 64.9%)',
            uiFillPrimary: 'hsl(0 0% 98%)',
            uiTextMuted: 'hsl(240 5% 64.9%)',
            tagText: 'hsl(240 5% 64.9%)',
            primary: 'hsl(0 0% 98%)',
        }
    };

    const masterTl = gsap.timeline({
      repeat: -1,
      repeatDelay: 3,
      defaults: { ease: 'power2.out', duration: 0.6 }
    });

    const setup = () => {
        const validUis = uis.map(r => r.current).filter(Boolean);

        gsap.set(validUis, { autoAlpha: 0 });
        gsap.set(tagGroups.map(r => r.current).filter(Boolean), { autoAlpha: 1 });
        
        if (scrollGroupRef.current) gsap.set(scrollGroupRef.current, { y: 0 });
        if (cursorRef.current) gsap.set(cursorRef.current, { autoAlpha: 0, x: 250, y: 100 });
        
        if (heroHeadlineRef.current) heroHeadlineRef.current.textContent = '';
        if (heroSubtitleRef.current) heroSubtitleRef.current.textContent = '';

        if (sunIconRef.current && moonIconRef.current) {
          gsap.set(sunIconRef.current, { autoAlpha: 1, scale: 1, rotation: 0 });
          gsap.set(moonIconRef.current, { autoAlpha: 0, scale: 0, rotation: 90 });
        }
        
        gsap.set(svg.querySelectorAll('.main-bg'), { fill: colors.light.bg });
        gsap.set(svg.querySelectorAll('.ui-bg'), { fill: colors.light.uiBg });
        gsap.set(svg.querySelectorAll('.ui-stroke'), { fill: 'none', stroke: colors.light.uiStroke });
        gsap.set(svg.querySelectorAll('.ui-fill-muted'), { fill: colors.light.uiFillMuted });
        gsap.set(svg.querySelectorAll('.ui-fill-primary'), { fill: colors.light.uiFillPrimary });
        gsap.set(svg.querySelectorAll('.ui-text-muted'), { fill: colors.light.uiTextMuted });
        gsap.set(svg.querySelectorAll('.tag-text'), { fill: colors.light.tagText });
        gsap.set(svg.querySelectorAll('.ui-primary-stroke'), { stroke: colors.light.uiFillPrimary });
        if (logoTextRef.current) {
            gsap.set(logoTextRef.current, { fill: colors.light.primary });
        }
    };

    const animateSection = (tagGroupRef: React.RefObject<SVGGElement>, uiRef: React.RefObject<SVGGElement>) => {
      const tl = gsap.timeline();
      if (tagGroupRef.current && uiRef.current) {
        tl.to(tagGroupRef.current, { autoAlpha: 0, duration: 0.3 })
          .to(uiRef.current, { autoAlpha: 1, duration: 0.5 }, '<0.1');
      }
      return tl;
    };
    
    const headlineText = "ARTISTRY MEETS ARCHITECTURE";
    const subtitleText = "Crafting unique digital experiences.";

    const typeText = (ref: React.RefObject<SVGTextElement>, text: string, duration: number) => {
        const tl = gsap.timeline();
        if (!ref.current) return tl;
        const temp = { i: 0 };
        tl.to(temp, {
            i: text.length,
            duration: duration,
            ease: `steps(${text.length})`,
            onUpdate: () => {
                if (ref.current) {
                    ref.current.textContent = text.substring(0, Math.ceil(temp.i));
                }
            }
        });
        return tl;
    };

    // --- ANIMATION SEQUENCE ---
    masterTl.add(setup);

    masterTl.add(animateSection(navTagGroupRef, navUiRef), "+=1");
    masterTl.add(animateSection(heroTagGroupRef, heroUiRef), "+=0.2");
    
    masterTl.add(typeText(heroHeadlineRef, headlineText, 1.2), "+=0.5");
    masterTl.add(typeText(heroSubtitleRef, subtitleText, 1.2), "+=0.2");

    // --- About Section Custom Animation ---
    const aboutTl = gsap.timeline();
    if (aboutTagGroupRef.current && aboutUiRef.current) {
        const image = aboutUiRef.current.querySelector('.about-image');
        const textLines = aboutUiRef.current.querySelectorAll('.about-text-line');
        
        aboutTl.to(aboutTagGroupRef.current, { autoAlpha: 0, duration: 0.3 });
        aboutTl.to(aboutUiRef.current, { autoAlpha: 1, duration: 0.01 }, '<0.1');

        if (image) {
            aboutTl.fromTo(image, 
                { autoAlpha: 0, scale: 0.9 },
                { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'power2.out' }, 
                '>'
            );
        }
        if (textLines.length > 0) {
            aboutTl.fromTo(textLines, 
                { autoAlpha: 0, x: -15 },
                { autoAlpha: 1, x: 0, stagger: 0.1, duration: 0.4, ease: 'power2.out' }, 
                '>-0.3'
            );
        }
    }
    masterTl.add(aboutTl, '+=0.5');

    masterTl.add(animateSection(servicesTagGroupRef, servicesUiRef), "+=0.2");
    masterTl.add(animateSection(contactTagGroupRef, contactUiRef), "+=0.2");
    
    // Interaction phase
    masterTl.addLabel('interact', "+=1.5");

    // 1. Show cursor and move to theme toggle
    if (cursorRef.current && themeToggleRef.current) {
        const themeToggleBBox = themeToggleRef.current.getBBox();
        masterTl.to(cursorRef.current, { 
          autoAlpha: 1, 
          x: themeToggleBBox.x + themeToggleBBox.width / 2, 
          y: themeToggleBBox.y + themeToggleBBox.height / 2,
          duration: 0.7
        }, 'interact');
    }
    
    // Animate the theme toggle
    const toggleTl = gsap.timeline();
    const allAnimatedElements = {
        mainBg: svg.querySelectorAll('.main-bg'),
        uiBg: svg.querySelectorAll('.ui-bg'),
        uiStroke: svg.querySelectorAll('.ui-stroke'),
        uiFillMuted: svg.querySelectorAll('.ui-fill-muted'),
        uiFillPrimary: svg.querySelectorAll('.ui-fill-primary'),
        uiTextMuted: svg.querySelectorAll('.ui-text-muted'),
        tagText: svg.querySelectorAll('.tag-text'),
        uiPrimaryStroke: svg.querySelectorAll('.ui-primary-stroke'),
        logo: logoTextRef.current,
    };
    
    toggleTl.to(sunIconRef.current, { scale: 0, rotation: 90, autoAlpha: 0, duration: 0.4, ease: 'power2.in' })
            .to(moonIconRef.current, { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.4, ease: 'power2.out' }, '>-0.3')
            .to(allAnimatedElements.mainBg, { fill: colors.dark.bg, duration: 0.5 }, '<')
            .to(allAnimatedElements.uiBg, { fill: colors.dark.uiBg, duration: 0.5 }, '<')
            .to(allAnimatedElements.uiStroke, { stroke: colors.dark.uiStroke, duration: 0.5 }, '<')
            .to(allAnimatedElements.uiFillMuted, { fill: colors.dark.uiFillMuted, duration: 0.5 }, '<')
            .to(allAnimatedElements.uiFillPrimary, { fill: colors.dark.uiFillPrimary, duration: 0.5 }, '<')
            .to(allAnimatedElements.uiTextMuted, { fill: colors.dark.uiTextMuted, duration: 0.5 }, '<')
            .to(allAnimatedElements.tagText, { fill: colors.dark.tagText, duration: 0.5 }, '<')
            .to(allAnimatedElements.uiPrimaryStroke, { stroke: colors.dark.uiFillPrimary, duration: 0.5 }, '<')
            .to(allAnimatedElements.logo, { fill: colors.dark.primary, duration: 0.5}, '<');

    masterTl.add(toggleTl, '+=0.2');

    // 2. Click 'Services' nav link
    if (cursorRef.current && servicesLinkRef.current) {
        const servicesLinkBBox = servicesLinkRef.current.getBBox();
        masterTl.to(cursorRef.current, {
          x: servicesLinkBBox.x + servicesLinkBBox.width / 2,
          y: servicesLinkBBox.y + servicesLinkBBox.height / 2,
          duration: 0.7
        }, '+=0.5');
        masterTl.to(servicesLinkRef.current, { scale: 0.9, yoyo: true, repeat: 1, duration: 0.15, transformOrigin: 'center' });
    }
    
    // 3. Scroll to services section
    if (scrollGroupRef.current && servicesUiRef.current) {
        const servicesUiBBox = servicesUiRef.current.getBBox();
        const servicesY = servicesUiBBox.y;
        masterTl.to(scrollGroupRef.current, { y: -servicesY + 60, duration: 1.5, ease: 'power3.inOut' }, '+=0.3');
    }

    // 4. Scroll back to top
    if (scrollGroupRef.current) {
        masterTl.to(scrollGroupRef.current, { y: 0, duration: 1.5, ease: 'power3.inOut' }, '+=1.5');
    }

    // Fade out for reset
    const allUiElements = uis.map(r => r.current).filter(Boolean);
    if(cursorRef.current) {
      masterTl.to([cursorRef.current, ...allUiElements], { autoAlpha: 0, duration: 0.8 }, '+=1');
    } else {
      masterTl.to(allUiElements, { autoAlpha: 0, duration: 0.8 }, '+=1');
    }


    return () => {
      masterTl.kill();
    };
  }, [theme]);

  return (
    <svg ref={svgRef} viewBox="0 0 500 500" className="h-full w-full object-contain">
      <defs>
        <style>
          {`
            .tag-text {
              font-family: 'Roboto Mono', monospace;
              font-weight: 500;
              font-size: 16px;
            }
            .main-bg { }
            .ui-bg { }
            .ui-stroke { stroke-width: 1.5; }
            .ui-fill-muted { }
            .ui-fill-primary { }
            .ui-primary-stroke { }
            .ui-text-muted { font-family: sans-serif; }
            .logo-text { font-family: Poppins, sans-serif; font-size: 12px; font-weight: bold; }
            .hero-headline { font-family: Poppins, sans-serif; font-size: 14px; font-weight: 600; letter-spacing: -0.5px; text-anchor: middle; }
            .hero-subtitle { font-size: 8px; text-anchor: middle; }
            .nav-link { font-size: 9px; text-anchor: middle; cursor: pointer; }
          `}
        </style>
        <clipPath id="mainClip">
          <rect x="20" y="20" width="460" height="460" rx="10" />
        </clipPath>
        <g id="cursor" ref={cursorRef} transform="scale(1.5)">
            <path fill="hsl(var(--foreground))" d="M11.22,9.45,3.95,2.18A1.07,1.07,0,0,0,2.44,2.18L2.18,2.44a1.07,1.07,0,0,0,0,1.51l7.27,7.27-2.3,6.89a1.06,1.06,0,0,0,1,1.33,1,1,0,0,0,.32-.06l7.15-2.4a1.07,1.07,0,0,0,.68-1Z"/>
        </g>
      </defs>

      <rect x="20" y="20" width="460" height="460" rx="10" class="main-bg ui-stroke" stroke-width="2"/>
      <g clipPath="url(#mainClip)">
        <g ref={scrollGroupRef}>
            {/* --- Navbar --- */}
            <g transform="translate(250, 50)">
              <g ref={navTagGroupRef}>
                <text className="tag-text" text-anchor="middle">&lt;Navbar /&gt;</text>
              </g>
              <g ref={navUiRef}>
                  <rect x="-210" y="0" width="420" height="30" class="ui-bg" />
                  <text ref={logoTextRef} x="-200" y="19" className="logo-text ui-fill-primary">KRYVE</text>
                  <text x="-50" y="17.5" className="nav-link ui-text-muted">About</text>
                  <text ref={servicesLinkRef} x="0" y="17.5" className="nav-link ui-text-muted">Services</text>
                  <text x="50" y="17.5" className="nav-link ui-text-muted">Work</text>
                  <g ref={themeToggleRef} transform="translate(185, 8)" style={{ cursor: 'pointer' }}>
                    <g ref={sunIconRef}>
                        <circle cx="7" cy="7" r="2.5" fill="none" className="ui-primary-stroke" stroke-width="1.2"/>
                        <path d="M7 1V3 M7 11V13 M2.64 2.64L3.35 3.35 M10.65 10.65L11.36 11.36 M1 7H3 M11 7H13 M2.64 11.36L3.35 10.65 M10.65 3.35L11.36 2.64"
                              className="ui-primary-stroke" stroke-width="1.2" stroke-linecap="round" />
                    </g>
                    <g ref={moonIconRef}>
                        <path d="M10 2.5 A5.5 5.5 0 0 1 2.5 10 A4 4 0 0 0 10 2.5z" className="ui-fill-primary"/>
                    </g>
                  </g>
              </g>
            </g>

            {/* --- Hero --- */}
            <g transform="translate(250, 130)">
              <g ref={heroTagGroupRef}>
                <text className="tag-text" text-anchor="middle">&lt;Hero /&gt;</text>
              </g>
              <g ref={heroUiRef}>
                <text ref={heroHeadlineRef} y="0" className="hero-headline ui-fill-primary"></text>
                <text ref={heroSubtitleRef} y="20" className="hero-subtitle"></text>
              </g>
            </g>

            {/* --- About --- */}
            <g transform="translate(250, 220)">
                <g ref={aboutTagGroupRef}>
                    <text className="tag-text" text-anchor="middle">&lt;About /&gt;</text>
                </g>
                <g ref={aboutUiRef}>
                    <g className="about-image">
                        <rect x="-150" y="-20" width="100" height="80" rx="5" className="ui-bg ui-stroke" stroke-width="1"/>
                        <path d="M -140 45 l 20 -20 l 15 15 l 20 -25 l 25 30" fill="none" className="ui-primary-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="-130" cy="-5" r="5" className="ui-fill-primary" opacity="0.5"/>
                    </g>
                    <g className="about-text">
                        <rect x="-30" y="-20" width="180" height="12" rx="3" className="about-text-line ui-fill-primary" />
                        <rect x="-30" y="5" width="180" height="6" rx="2" className="about-text-line ui-fill-muted" opacity="0.6"/>
                        <rect x="-30" y="15" width="150" height="6" rx="2" className="about-text-line ui-fill-muted" opacity="0.6"/>
                        <rect x="-30" y="25" width="180" height="6" rx="2" className="about-text-line ui-fill-muted" opacity="0.6"/>
                        <rect x="-30" y="35" width="100" height="6" rx="2" className="about-text-line ui-fill-muted" opacity="0.6"/>
                    </g>
                </g>
            </g>

            {/* --- Services --- */}
            <g transform="translate(250, 310)">
              <g ref={servicesTagGroupRef}>
                <text className="tag-text" text-anchor="middle">&lt;Services /&gt;</text>
              </g>
              <g ref={servicesUiRef}>
                  <rect x="-180" y="-10" width="100" height="50" rx="5" class="ui-bg ui-stroke" stroke-width="1" />
                  <rect x="-170" y="0" width="20" height="8" rx="2" class="ui-fill-primary" />
                  <rect x="-170" y="12" width="80" height="4" rx="2" class="ui-fill-muted" opacity="0.3" />
                  <rect x="-170" y="20" width="60" height="4" rx="2" class="ui-fill-muted" opacity="0.3" />
                  
                  <rect x="-70" y="-10" width="100" height="50" rx="5" class="ui-bg ui-stroke" stroke-width="1" />
                  <rect x="-60" y="0" width="20" height="8" rx="2" class="ui-fill-primary" />
                  <rect x="-60" y="12" width="80" height="4" rx="2" class="ui-fill-muted" opacity="0.3" />
                  <rect x="-60" y="20" width="60" height="4" rx="2" class="ui-fill-muted" opacity="0.3" />

                  <rect x="40" y="-10" width="100" height="50" rx="5" class="ui-bg ui-stroke" stroke-width="1" />
                  <rect x="50" y="0" width="20" height="8" rx="2" class="ui-fill-primary" />
                  <rect x="50" y="12" width="80" height="4" rx="2" class="ui-fill-muted" opacity="0.3" />
                  <rect x="50" y="20" width="60" height="4" rx="2" class="ui-fill-muted" opacity="0.3" />
              </g>
            </g>
            
            {/* --- Contact --- */}
            <g transform="translate(250, 410)">
              <g ref={contactTagGroupRef}>
                <text className="tag-text" text-anchor="middle">&lt;Contact /&gt;</text>
              </g>
              <g ref={contactUiRef}>
                <rect x="-120" y="-25" width="240" height="12" rx="3" class="ui-fill-muted" />
                <rect x="-150" y="0" width="145" height="20" rx="4" class="ui-bg ui-stroke" stroke-width="1" />
                <rect x="5" y="0" width="145" height="20" rx="4" class="ui-bg ui-stroke" stroke-width="1" />
                <rect x="-80" y="30" width="160" height="25" rx="5" class="ui-fill-primary" />
              </g>
            </g>
        </g>
      </g>
    </svg>
  );
}
