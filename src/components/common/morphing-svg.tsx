'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { gsap } from 'gsap';

interface MorphingSvgProps {
  theme?: string;
}

export function MorphingSvg({ theme }: MorphingSvgProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // Main container refs
  const scrollGroupRef = useRef<SVGGElement>(null);

  // Tag group refs
  const navTagGroupRef = useRef<SVGGElement>(null);
  const heroTagGroupRef = useRef<SVGGElement>(null);
  const aboutTagGroupRef = useRef<SVGGElement>(null);
  const servicesTagGroupRef = useRef<SVGGElement>(null);
  const projectsTagGroupRef = useRef<SVGGElement>(null);
  const creativeTagGroupRef = useRef<SVGGElement>(null);
  const contactTagGroupRef = useRef<SVGGElement>(null);
  const footerTagGroupRef = useRef<SVGGElement>(null);

  // UI group refs
  const navUiRef = useRef<SVGGElement>(null);
  const heroUiRef = useRef<SVGGElement>(null);
  const aboutUiRef = useRef<SVGGElement>(null);
  const servicesUiRef = useRef<SVGGElement>(null);
  const projectsUiRef = useRef<SVGGElement>(null);
  const creativeUiRef = useRef<SVGGElement>(null);
  const contactUiRef = useRef<SVGGElement>(null);
  const footerUiRef = useRef<SVGGElement>(null);

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
    
    const tagGroups = [navTagGroupRef, heroTagGroupRef, aboutTagGroupRef, servicesTagGroupRef, projectsTagGroupRef, creativeTagGroupRef, contactTagGroupRef, footerTagGroupRef];
    const uis = [navUiRef, heroUiRef, aboutUiRef, servicesUiRef, projectsUiRef, creativeUiRef, contactUiRef, footerUiRef];
    
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
      repeatDelay: 0.5,
      defaults: { ease: 'power2.out', duration: 0.6 }
    });

    const setup = () => {
        const allUiElements = uis.map(r => r.current).filter(Boolean);
        const allTagElements = tagGroups.map(r => r.current).filter(Boolean);

        gsap.set(allUiElements, { autoAlpha: 0 });
        gsap.set(allTagElements, { autoAlpha: 1 });
        
        if (scrollGroupRef.current) gsap.set(scrollGroupRef.current, { y: 0 });
        
        if (heroHeadlineRef.current) heroHeadlineRef.current.textContent = '';
        if (heroSubtitleRef.current) heroSubtitleRef.current.textContent = '';
        
        const serviceDescGroups = svg.querySelectorAll('.service-desc-group');
        gsap.set(serviceDescGroups, { autoAlpha: 0 });

        if (sunIconRef.current && moonIconRef.current) {
          gsap.set(sunIconRef.current, { autoAlpha: 1, scale: 1, rotation: 0 });
          gsap.set(moonIconRef.current, { autoAlpha: 0, scale: 0, rotation: 90 });
        }
        
        const startTheme = theme === 'dark' ? colors.dark : colors.light;
        
        gsap.set(svg.querySelectorAll('.main-bg'), { fill: startTheme.bg });
        gsap.set(svg.querySelectorAll('.ui-bg'), { fill: startTheme.uiBg });
        gsap.set(svg.querySelectorAll('.ui-stroke'), { fill: 'none', stroke: startTheme.uiStroke });
        gsap.set(svg.querySelectorAll('.ui-fill-muted'), { fill: startTheme.uiFillMuted });
        gsap.set(svg.querySelectorAll('.ui-fill-primary'), { fill: startTheme.uiFillPrimary });
        gsap.set(svg.querySelectorAll('.ui-text-muted'), { fill: startTheme.uiTextMuted });
        gsap.set(svg.querySelectorAll('.tag-text'), { fill: startTheme.tagText });
        gsap.set(svg.querySelectorAll('.ui-primary-stroke'), { stroke: startTheme.uiFillPrimary });
        if (logoTextRef.current) {
            gsap.set(logoTextRef.current, { fill: startTheme.primary });
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
        
        aboutTl.add(animateSection(aboutTagGroupRef, aboutUiRef));
        
        if (image && textLines) {
            aboutTl.fromTo(image, 
                { autoAlpha: 0, scale: 0.9 },
                { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'power2.out' }, 
                '>-0.5'
            );
            aboutTl.fromTo(textLines, 
                { autoAlpha: 0, x: -15 },
                { autoAlpha: 1, x: 0, stagger: 0.1, duration: 0.4, ease: 'power2.out' }, 
                '>-0.3'
            );
        }
    }
    masterTl.add(aboutTl, '+=0.5');

    // --- Services Section Custom Animation ---
    const servicesTl = gsap.timeline();
    if (servicesTagGroupRef.current && servicesUiRef.current) {
        const cards = servicesUiRef.current.querySelectorAll('.service-card');
        
        servicesTl.add(animateSection(servicesTagGroupRef, servicesUiRef));

        if (cards.length > 0) {
            servicesTl.fromTo(cards, 
                { autoAlpha: 0, y: 20 },
                { autoAlpha: 1, y: 0, stagger: 0.15, duration: 0.4, ease: 'power2.out' }, 
                '>-0.5'
            );
        }
    }
    masterTl.add(servicesTl, '+=0.5');

    masterTl.add(animateSection(projectsTagGroupRef, projectsUiRef), "+=0.2");
    masterTl.add(animateSection(creativeTagGroupRef, creativeUiRef), "+=0.2");
    masterTl.add(animateSection(contactTagGroupRef, contactUiRef), "+=0.2");
    masterTl.add(animateSection(footerTagGroupRef, footerUiRef), "+=0.2");
    
    // Interaction phase
    masterTl.addLabel('interact', "+=1.5");

    // Animate the theme toggle
    const toggleTl = gsap.timeline();
    
    const currentTheme = theme === 'dark' ? 'dark' : 'light';
    const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';

    const toColors = colors[targetTheme];
    
    if (sunIconRef.current && moonIconRef.current) {
        toggleTl.to(sunIconRef.current, { scale: targetTheme === 'light' ? 1 : 0, rotation: targetTheme === 'light' ? 0 : 90, autoAlpha: targetTheme === 'light' ? 1 : 0, duration: 0.4, ease: 'power2.in' })
                .to(moonIconRef.current, { scale: targetTheme === 'light' ? 0 : 1, rotation: targetTheme === 'light' ? -90 : 0, autoAlpha: targetTheme === 'light' ? 0 : 1, duration: 0.4, ease: 'power2.out' }, '>-0.3');
    }

    toggleTl.to(svg.querySelectorAll('.main-bg'), { fill: toColors.bg, duration: 0.5 }, '<')
            .to(svg.querySelectorAll('.ui-bg'), { fill: toColors.uiBg, duration: 0.5 }, '<')
            .to(svg.querySelectorAll('.ui-stroke'), { stroke: toColors.uiStroke, duration: 0.5 }, '<')
            .to(svg.querySelectorAll('.ui-fill-muted'), { fill: toColors.uiFillMuted, duration: 0.5 }, '<')
            .to(svg.querySelectorAll('.ui-fill-primary'), { fill: toColors.uiFillPrimary, duration: 0.5 }, '<')
            .to(svg.querySelectorAll('.ui-text-muted'), { fill: toColors.uiTextMuted, duration: 0.5 }, '<')
            .to(svg.querySelectorAll('.tag-text'), { fill: toColors.tagText, duration: 0.5 }, '<')
            .to(svg.querySelectorAll('.ui-primary-stroke'), { stroke: toColors.uiFillPrimary, duration: 0.5 }, '<');

    if (logoTextRef.current) {
      toggleTl.to(logoTextRef.current, { fill: toColors.primary, duration: 0.5}, '<');
    }

    masterTl.add(toggleTl, '+=0.2');

    // 2. Animate 'Services' nav link click
    if (navUiRef.current) {
      const navPulseTl = gsap.timeline();
      navPulseTl.to(navUiRef.current, {
        scale: 1.02,
        yoyo: true,
        repeat: 1,
        duration: 0.2,
        transformOrigin: 'center'
      });
      masterTl.add(navPulseTl, '+=0.5');
    }
    
    // 3. Scroll to services section and animate content
    if (scrollGroupRef.current && servicesUiRef.current) {
        const serviceDescGroups = svg.querySelectorAll('.service-desc-group');
        
        masterTl.to(scrollGroupRef.current, { y: -350, duration: 1.5, ease: 'power3.inOut' }, '+=0.3');
        
        if (serviceDescGroups.length > 0) {
            masterTl.fromTo(serviceDescGroups,
                { autoAlpha: 0, y: 10 },
                { autoAlpha: 1, y: 0, stagger: 0.2, duration: 0.5, ease: 'power2.out' },
                '>-0.8'
            );
        }
    }

    // 4. Scroll back to top and fade out gracefully
    const endTl = gsap.timeline();
    const allFadeElements = uis.map(r => r.current).filter(Boolean);

    if (scrollGroupRef.current) {
        endTl.to(scrollGroupRef.current, { y: 0, duration: 1.5, ease: 'power3.inOut' });
    }
    if (allFadeElements.length > 0) {
        endTl.to(allFadeElements, { autoAlpha: 0, duration: 0.8 }, '<0.7');
    }
    masterTl.add(endTl, "+=1.5");

    return () => {
      masterTl.kill();
    };
  }, [theme]);

  return (
    <svg ref={svgRef} viewBox="0 0 600 1200" preserveAspectRatio="xMidYMin slice" className="h-full w-full">
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
            .hero-headline { font-family: Poppins, sans-serif; font-size: 16px; font-weight: 600; letter-spacing: -0.5px; text-anchor: middle; }
            .hero-subtitle { font-size: 9px; text-anchor: middle; }
            .nav-link { font-size: 9px; text-anchor: middle; cursor: pointer; }
            .service-title { font-size: 9px; font-weight: 600; }
            .service-desc { font-size: 8px; }
            .project-title { font-size: 10px; font-weight: 600; }
            .project-desc { font-size: 8px; }
            .contact-title { font-size: 12px; font-weight: 600; text-anchor: middle; }
          `}
        </style>
        <clipPath id="mainClip">
          <rect x="20" y="20" width="560" height="1160" rx="10" />
        </clipPath>
      </defs>

      <rect x="20" y="20" width="560" height="1160" rx="10" class="main-bg ui-stroke" stroke-width="2"/>
      <g clipPath="url(#mainClip)">
        {/* --- FIXED Navbar --- */}
        <g transform="translate(300, 50)">
          <g ref={navTagGroupRef}>
            <text className="tag-text" text-anchor="middle">&lt;Navbar /&gt;</text>
          </g>
          <g ref={navUiRef}>
              <rect x="-280" y="-15" width="560" height="30" class="ui-bg" />
              <text ref={logoTextRef} x="-270" y="6" className="logo-text">KRYVE</text>
              <text x="-50" y="5.5" className="nav-link ui-text-muted">About</text>
              <text ref={servicesLinkRef} x="20" y="5.5" className="nav-link ui-text-muted">Services</text>
              <text x="90" y="5.5" className="nav-link ui-text-muted">Work</text>
              <g ref={themeToggleRef} transform="translate(235, -7)" style={{ cursor: 'pointer' }}>
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
        
        {/* --- SCROLLING CONTENT --- */}
        <g ref={scrollGroupRef}>
            {/* --- Hero --- */}
            <g transform="translate(300, 150)">
              <g ref={heroTagGroupRef}>
                <text className="tag-text" text-anchor="middle">&lt;Hero /&gt;</text>
              </g>
              <g ref={heroUiRef}>
                <text ref={heroHeadlineRef} y="0" className="hero-headline ui-fill-primary"></text>
                <text ref={heroSubtitleRef} y="20" className="hero-subtitle ui-text-muted"></text>
              </g>
            </g>

            {/* --- About --- */}
            <g transform="translate(300, 300)">
                <g ref={aboutTagGroupRef}>
                    <text className="tag-text" text-anchor="middle">&lt;About /&gt;</text>
                </g>
                <g ref={aboutUiRef}>
                    <g className="about-image">
                        <rect x="-190" y="-40" width="140" height="100" rx="5" className="ui-bg ui-stroke" stroke-width="1"/>
                        <path d="M -180 45 l 20 -20 l 25 25 l 30 -35 l 35 40" fill="none" className="ui-primary-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="-165" cy="-20" r="8" className="ui-fill-primary" opacity="0.5"/>
                    </g>
                    <g className="about-text">
                        <rect x="-20" y="-40" width="220" height="16" rx="3" className="about-text-line ui-fill-primary" />
                        <rect x="-20" y="-10" width="220" height="8" rx="2" className="about-text-line ui-fill-muted" opacity="0.6"/>
                        <rect x="-20" y="5" width="180" height="8" rx="2" className="about-text-line ui-fill-muted" opacity="0.6"/>
                        <rect x="-20" y="20" width="220" height="8" rx="2" className="about-text-line ui-fill-muted" opacity="0.6"/>
                        <rect x="-20" y="35" width="120" height="8" rx="2" className="about-text-line ui-fill-muted" opacity="0.6"/>
                    </g>
                </g>
            </g>

            {/* --- Services --- */}
            <g transform="translate(300, 450)">
                <g ref={servicesTagGroupRef}>
                    <text className="tag-text" text-anchor="middle">&lt;Services /&gt;</text>
                </g>
                <g ref={servicesUiRef}>
                    <g className="service-card" transform="translate(-160, 0)">
                        <rect x="-70" y="-40" width="140" height="90" rx="5" class="ui-bg ui-stroke" stroke-width="1" />
                        <rect x="-60" y="-30" width="24" height="12" rx="3" class="ui-fill-primary" />
                        <text x="-60" y="-5" className="service-title ui-fill-primary">Web Design</text>
                        <g className="service-desc-group">
                          <text x="-60" y="10" className="service-desc ui-text-muted">Visually stunning</text>
                          <text x="-60" y="20" className="service-desc ui-text-muted">interfaces.</text>
                        </g>
                    </g>
                    <g className="service-card" transform="translate(0, 0)">
                        <rect x="-70" y="-40" width="140" height="90" rx="5" class="ui-bg ui-stroke" stroke-width="1" />
                        <rect x="-60" y="-30" width="24" height="12" rx="3" class="ui-fill-primary" />
                        <text x="-60" y="-5" className="service-title ui-fill-primary">Development</text>
                        <g className="service-desc-group">
                          <text x="-60" y="10" className="service-desc ui-text-muted">Robust &amp; Scalable</text>
                          <text x="-60" y="20" className="service-desc ui-text-muted">solutions.</text>
                        </g>
                    </g>
                    <g className="service-card" transform="translate(160, 0)">
                        <rect x="-70" y="-40" width="140" height="90" rx="5" class="ui-bg ui-stroke" stroke-width="1" />
                        <rect x="-60" y="-30" width="24" height="12" rx="3" class="ui-fill-primary" />
                        <text x="-60" y="-5" className="service-title ui-fill-primary">Branding</text>
                        <g className="service-desc-group">
                          <text x="-60" y="10" className="service-desc ui-text-muted">Unique brand</text>
                          <text x="-60" y="20" className="service-desc ui-text-muted">identities.</text>
                        </g>
                    </g>
                </g>
            </g>

             {/* --- Projects --- */}
            <g transform="translate(300, 620)">
              <g ref={projectsTagGroupRef}>
                  <text className="tag-text" text-anchor="middle">&lt;Projects /&gt;</text>
              </g>
              <g ref={projectsUiRef}>
                  <rect x="-220" y="-50" width="200" height="120" rx="5" class="ui-bg ui-stroke" />
                  <rect x="-210" y="-40" width="180" height="70" rx="3" class="ui-fill-muted" opacity="0.3"/>
                  <text x="-210" y="45" class="project-title ui-fill-primary">Project One</text>
                  <text x="-210" y="60" class="project-desc ui-text-muted">A short description here.</text>
                  
                  <rect x="20" y="-50" width="200" height="120" rx="5" class="ui-bg ui-stroke" />
                  <rect x="30" y="-40" width="180" height="70" rx="3" class="ui-fill-muted" opacity="0.3"/>
                  <text x="30" y="45" class="project-title ui-fill-primary">Project Two</text>
                  <text x="30" y="60" class="project-desc ui-text-muted">Another short description.</text>
              </g>
            </g>

            {/* --- Creative --- */}
            <g transform="translate(300, 780)">
              <g ref={creativeTagGroupRef}>
                  <text className="tag-text" text-anchor="middle">&lt;Creative /&gt;</text>
              </g>
              <g ref={creativeUiRef}>
                  <circle cx="-60" cy="0" r="50" class="ui-fill-muted" opacity="0.1"/>
                  <path d="M 50 -50 Q 0 0 50 50" fill="none" class="ui-primary-stroke" stroke-width="2"/>
                  <rect x="-40" y="-40" width="80" height="80" rx="5" fill="none" class="ui-primary-stroke" stroke-dasharray="5 5" />
              </g>
            </g>
            
            {/* --- Contact --- */}
            <g transform="translate(300, 900)">
              <g ref={contactTagGroupRef}>
                <text className="tag-text" text-anchor="middle">&lt;Contact /&gt;</text>
              </g>
              <g ref={contactUiRef}>
                <text y="-35" class="contact-title ui-fill-primary">Let's build together.</text>
                <rect x="-150" y="-10" width="145" height="25" rx="4" class="ui-bg ui-stroke" stroke-width="1" />
                <rect x="5" y="-10" width="145" height="25" rx="4" class="ui-bg ui-stroke" stroke-width="1" />
                <rect x="-100" y="25" width="200" height="30" rx="5" class="ui-fill-primary" />
              </g>
            </g>
        </g>
        
        {/* --- FIXED Footer --- */}
        <g transform="translate(300, 1150)">
          <g ref={footerTagGroupRef}>
              <text className="tag-text" text-anchor="middle">&lt;Footer /&gt;</text>
          </g>
          <g ref={footerUiRef}>
              <rect x="-280" y="-15" width="560" height="30" class="ui-bg" />
              <text x="-270" y="6" class="logo-text ui-fill-primary">KRYVE</text>
              <text x="0" y="5" font-size="8" text-anchor="middle" class="ui-text-muted">&copy; 2024. All rights reserved.</text>
              <circle cx="240" cy="5" r="6" class="ui-fill-muted" />
              <circle cx="258" cy="5" r="6" class="ui-fill-muted" />
              <circle cx="276" cy="5" r="6" class="ui-fill-muted" />
          </g>
        </g>
      </g>
    </svg>
  );
}
