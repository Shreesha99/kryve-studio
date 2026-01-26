'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { gsap } from 'gsap';

interface MorphingSvgProps {
  theme?: string;
}

export function MorphingSvg({ theme }: MorphingSvgProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const scrollGroupRef = useRef<SVGGElement>(null);

  const navUiRef = useRef<SVGGElement>(null);
  const heroUiRef = useRef<SVGGElement>(null);
  const aboutUiRef = useRef<SVGGElement>(null);
  const servicesUiRef = useRef<SVGGElement>(null);
  const projectsUiRef = useRef<SVGGElement>(null);
  const creativeUiRef = useRef<SVGGElement>(null);
  const contactUiRef = useRef<SVGGElement>(null);
  const footerUiRef = useRef<SVGGElement>(null);

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
    
    const uis = [navUiRef, heroUiRef, aboutUiRef, servicesUiRef, projectsUiRef, creativeUiRef, contactUiRef, footerUiRef];
    
    const colors = {
        light: {
            bg: 'hsl(0 0% 100%)',
            uiBg: 'hsl(240 4.8% 95.9%)',
            uiStroke: 'hsl(240 5.9% 90%)',
            uiFillMuted: 'hsl(240 3.8% 46.1%)',
            uiFillPrimary: 'hsl(240 10% 3.9%)',
            uiTextMuted: 'hsl(240 3.8% 46.1%)',
            primary: 'hsl(240 10% 3.9%)',
        },
        dark: {
            bg: 'hsl(240 10% 3.9%)',
            uiBg: 'hsl(240 3.7% 15.9%)',
            uiStroke: 'hsl(240 3.7% 15.9%)',
            uiFillMuted: 'hsl(240 5% 64.9%)',
            uiFillPrimary: 'hsl(0 0% 98%)',
            uiTextMuted: 'hsl(240 5% 64.9%)',
            primary: 'hsl(0 0% 98%)',
        }
    };

    const masterTl = gsap.timeline({
      repeat: -1,
      repeatDelay: 0,
      defaults: { ease: 'power2.out', duration: 0.3 }
    });

    const setup = () => {
        const allUiElements = uis.map(r => r.current).filter(Boolean);
        gsap.set(allUiElements, { autoAlpha: 0 });
        if (scrollGroupRef.current) gsap.set(scrollGroupRef.current, { y: 0 });
        if (heroHeadlineRef.current) heroHeadlineRef.current.textContent = '';
        if (heroSubtitleRef.current) heroSubtitleRef.current.textContent = '';
        gsap.set(svg.querySelectorAll('.service-desc-group'), { autoAlpha: 0 });
        if (sunIconRef.current && moonIconRef.current) {
          gsap.set(sunIconRef.current, { autoAlpha: 1, scale: 1, rotation: 0 });
          gsap.set(moonIconRef.current, { autoAlpha: 0, scale: 0, rotation: 90 });
        }
        
        const startThemeKey = theme === 'dark' ? 'dark' : 'light';
        const startTheme = colors[startThemeKey];
        
        gsap.set(svg.querySelectorAll('.main-bg'), { fill: startTheme.bg });
        gsap.set(svg.querySelectorAll('.ui-bg'), { fill: startTheme.uiBg });
        gsap.set(svg.querySelectorAll('.ui-stroke'), { fill: 'none', stroke: startTheme.uiStroke });
        gsap.set(svg.querySelectorAll('.ui-fill-muted'), { fill: startTheme.uiFillMuted });
        gsap.set(svg.querySelectorAll('.ui-fill-primary'), { fill: startTheme.uiFillPrimary });
        gsap.set(svg.querySelectorAll('.ui-text-muted'), { fill: startTheme.uiTextMuted });
        gsap.set(svg.querySelectorAll('.ui-primary-stroke'), { stroke: startTheme.uiFillPrimary });
        if (logoTextRef.current) {
            gsap.set(logoTextRef.current, { fill: startTheme.primary });
        }
    };

    const animateSection = (uiRef: React.RefObject<SVGGElement>) => {
      const tl = gsap.timeline();
      if (uiRef.current) {
        tl.to(uiRef.current, { autoAlpha: 1, duration: 0.3 });
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
    masterTl.add(animateSection(navUiRef), "+=0.5");
    masterTl.add(animateSection(heroUiRef), "+=0.1");
    masterTl.add(typeText(heroHeadlineRef, headlineText, 0.8), "+=0.2");
    masterTl.add(typeText(heroSubtitleRef, subtitleText, 0.8), "+=0.1");

    const aboutTl = gsap.timeline();
    if (aboutUiRef.current) {
        const image = aboutUiRef.current.querySelector('.about-image');
        const textLines = aboutUiRef.current.querySelectorAll('.about-text-line');
        aboutTl.add(animateSection(aboutUiRef));
        if (image && textLines) {
            aboutTl.fromTo(image, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power2.out' }, '>-0.3');
            aboutTl.fromTo(textLines, { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, stagger: 0.06, duration: 0.3, ease: 'power2.out' }, '>-0.2');
        }
    }
    masterTl.add(aboutTl, '+=0.3');

    const servicesTl = gsap.timeline();
    if (servicesUiRef.current) {
        const cards = servicesUiRef.current.querySelectorAll('.service-card');
        servicesTl.add(animateSection(servicesUiRef));
        if (cards.length > 0) {
            servicesTl.fromTo(cards, { autoAlpha: 0, y: 15 }, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.3, ease: 'power2.out' }, '>-0.3');
        }
    }
    masterTl.add(servicesTl, '+=0.3');

    const projectsTl = gsap.timeline();
    if (projectsUiRef.current) {
        const projectCards = projectsUiRef.current.querySelectorAll('.project-card');
        projectsTl.add(animateSection(projectsUiRef));
        if (projectCards.length > 0) {
            projectsTl.fromTo(projectCards, { autoAlpha: 0, y: 15 }, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.3, ease: 'power2.out' }, '>-0.3' );
        }
    }
    masterTl.add(projectsTl, "+=0.1");
    
    const creativeTl = gsap.timeline();
    if (creativeUiRef.current) {
        creativeTl.add(animateSection(creativeUiRef));
        creativeTl.from(creativeUiRef.current.children, { scale: 0.8, autoAlpha: 0, stagger: 0.1, duration: 0.4, transformOrigin: 'center' }, '>-0.3');
    }
    masterTl.add(creativeTl, "+=0.1");

    const contactTl = gsap.timeline();
    if (contactUiRef.current) {
        const fields = contactUiRef.current.querySelectorAll('.contact-field');
        const button = contactUiRef.current.querySelector('.contact-button');
        contactTl.add(animateSection(contactUiRef));
        contactTl.from(fields, { autoAlpha: 0, x: -10, stagger: 0.08, duration: 0.3 }, '>-0.3');
        contactTl.from(button, { autoAlpha: 0, scale: 0.8, duration: 0.3 }, '>-0.2');
    }
    masterTl.add(contactTl, "+=0.1");
    masterTl.add(animateSection(footerUiRef), "+=0.1");
    
    masterTl.addLabel('interact', "+=0.8");

    const toggleTl = gsap.timeline();
    const startTheme = theme === 'dark' ? 'dark' : 'light';
    const targetTheme = startTheme === 'dark' ? 'light' : 'dark';
    const toColors = colors[targetTheme];
    
    if (sunIconRef.current && moonIconRef.current) {
        const sunState = { scale: 1, rotation: 0, autoAlpha: 1 };
        const moonState = { scale: 0, rotation: 90, autoAlpha: 0 };
        if (startTheme === 'dark') {
            [sunState, moonState].forEach(s => { [s.scale, s.autoAlpha] = [s.autoAlpha, s.scale]; s.rotation = -s.rotation; });
        }
        toggleTl.to(sunIconRef.current, { scale: moonState.scale, rotation: moonState.rotation, autoAlpha: moonState.autoAlpha, duration: 0.3, ease: 'power2.in' })
                .to(moonIconRef.current, { scale: sunState.scale, rotation: sunState.rotation, autoAlpha: sunState.autoAlpha, duration: 0.3, ease: 'power2.out' }, '>-0.25');
    }

    toggleTl.to(svg.querySelectorAll('.main-bg'), { fill: toColors.bg, duration: 0.4 }, '<')
            .to(svg.querySelectorAll('.ui-bg'), { fill: toColors.uiBg, duration: 0.4 }, '<')
            .to(svg.querySelectorAll('.ui-stroke'), { stroke: toColors.uiStroke, duration: 0.4 }, '<')
            .to(svg.querySelectorAll('.ui-fill-muted'), { fill: toColors.uiFillMuted, duration: 0.4 }, '<')
            .to(svg.querySelectorAll('.ui-fill-primary'), { fill: toColors.uiFillPrimary, duration: 0.4 }, '<')
            .to(svg.querySelectorAll('.ui-text-muted'), { fill: toColors.uiTextMuted, duration: 0.4 }, '<')
            .to(svg.querySelectorAll('.ui-primary-stroke'), { stroke: toColors.uiFillPrimary, duration: 0.4 }, '<');

    if (logoTextRef.current) {
      toggleTl.to(logoTextRef.current, { fill: toColors.primary, duration: 0.4}, '<');
    }
    masterTl.add(toggleTl, 'interact');

    const servicesClickTl = gsap.timeline();
    if (servicesLinkRef.current) {
        const originalColor = toColors.uiTextMuted;
        const activeColor = toColors.uiFillPrimary;
        servicesClickTl.to(servicesLinkRef.current, { fill: activeColor, scale: 1.05, transformOrigin: 'center middle', duration: 0.1 })
                       .to(servicesLinkRef.current, { fill: originalColor, scale: 1, duration: 0.2 });
    }
    masterTl.add(servicesClickTl, 'interact+=0.3');
    
    if (scrollGroupRef.current) {
        masterTl.to(scrollGroupRef.current, { y: -350, duration: 0.8, ease: 'power3.inOut' }, 'interact+=0.5');
        masterTl.fromTo(svg.querySelectorAll('.service-desc-group'), { autoAlpha: 0, y: 5 }, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.3, ease: 'power2.out' }, '>-0.4');
    }

    masterTl.addLabel('resetting', "+=0.8");
    const allUiElements = uis.map(r => r.current).filter(Boolean);
    const resetTl = gsap.timeline();
    if (scrollGroupRef.current) {
        resetTl.to(scrollGroupRef.current, { y: 0, duration: 0.8, ease: 'power2.inOut' });
    }
    if (allUiElements.length > 0) {
        resetTl.to(allUiElements, { autoAlpha: 0, duration: 0.4 }, '<0.2');
    }
    masterTl.add(resetTl, 'resetting');

    return () => {
      masterTl.kill();
    };
  }, [theme]);

  return (
    <svg ref={svgRef} viewBox="0 0 600 1200" preserveAspectRatio="xMidYMin slice" className="h-full w-full">
      <defs>
        <style>
          {`
            .logo-text { font-family: Poppins, sans-serif; font-size: 12px; font-weight: bold; }
            .hero-headline { font-family: Poppins, sans-serif; font-size: 16px; font-weight: 600; letter-spacing: -0.5px; text-anchor: middle; }
            .hero-subtitle { font-size: 9px; text-anchor: middle; }
            .nav-link { font-size: 9px; text-anchor: middle; cursor: pointer; }
            .about-title { font-size: 12px; font-weight: 600; }
            .about-text { font-size: 9px; }
            .service-title { font-size: 9px; font-weight: 600; }
            .service-desc { font-size: 8px; }
            .project-title { font-size: 10px; font-weight: 600; }
            .project-desc { font-size: 8px; }
            .contact-title { font-size: 12px; font-weight: 600; text-anchor: middle; }
            .contact-field-text { font-size: 9px; }
          `}
        </style>
        <clipPath id="mainClip">
          <rect x="20" y="20" width="560" height="1160" rx="10" />
        </clipPath>
      </defs>

      <rect x="20" y="20" width="560" height="1160" rx="10" className="main-bg ui-stroke" stroke-width="2"/>
      <g clipPath="url(#mainClip)">
        <g ref={scrollGroupRef}>
            {/* --- Hero --- */}
            <g transform="translate(300, 150)">
              <g ref={heroUiRef}>
                <text ref={heroHeadlineRef} y="0" className="hero-headline ui-fill-primary"></text>
                <text ref={heroSubtitleRef} y="20" className="hero-subtitle ui-text-muted"></text>
              </g>
            </g>

            {/* --- About --- */}
            <g transform="translate(300, 300)">
                <g ref={aboutUiRef}>
                    <g className="about-image">
                        <rect x="-190" y="-40" width="140" height="100" rx="5" className="ui-bg ui-stroke" stroke-width="1"/>
                        <path d="M -180 45 l 20 -20 l 25 25 l 30 -35 l 35 40" fill="none" className="ui-primary-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="-165" cy="-20" r="8" className="ui-fill-primary" opacity="0.5"/>
                    </g>
                    <g className="about-text">
                        <text x="-20" y="-30" class="about-title ui-fill-primary about-text-line">Our Philosophy</text>
                        <text x="-20" y="-10" class="about-text ui-text-muted about-text-line" >We believe in design that solves</text>
                        <text x="-20" y="2" class="about-text ui-text-muted about-text-line" >problems and code that feels</text>
                        <text x="-20" y="14" class="about-text ui-text-muted about-text-line">like magic.</text>
                        <rect x="-20" y="35" width="80" height="12" rx="3" class="about-text-line ui-fill-primary" />
                    </g>
                </g>
            </g>

            {/* --- Services --- */}
            <g transform="translate(300, 450)">
                <g ref={servicesUiRef}>
                    <g className="service-card" transform="translate(-160, 0)">
                        <rect x="-70" y="-40" width="140" height="90" rx="5" className="ui-bg ui-stroke" stroke-width="1" />
                        <path d="M-60 -25 h24 v12 h-24z" fill="none" className="ui-primary-stroke" stroke-width="1.5" />
                        <text x="-60" y="-5" className="service-title ui-fill-primary">Web Design</text>
                        <g className="service-desc-group">
                          <text x="-60" y="10" className="service-desc ui-text-muted">Visually stunning</text>
                          <text x="-60" y="20" className="service-desc ui-text-muted">interfaces.</text>
                        </g>
                    </g>
                    <g className="service-card" transform="translate(0, 0)">
                        <rect x="-70" y="-40" width="140" height="90" rx="5" className="ui-bg ui-stroke" stroke-width="1" />
                        <path d="M-55 -25 l-10 6 l10 6 M-45 -25 l10 6 l-10 6" fill="none" className="ui-primary-stroke" stroke-width="1.5" stroke-linecap="round" />
                        <text x="-60" y="-5" className="service-title ui-fill-primary">Development</text>
                        <g className="service-desc-group">
                          <text x="-60" y="10" className="service-desc ui-text-muted">Robust & Scalable</text>
                          <text x="-60" y="20" className="service-desc ui-text-muted">solutions.</text>
                        </g>
                    </g>
                    <g className="service-card" transform="translate(160, 0)">
                        <rect x="-70" y="-40" width="140" height="90" rx="5" className="ui-bg ui-stroke" stroke-width="1" />
                        <circle cx="-48" cy="-19" r="8" fill="none" className="ui-primary-stroke" stroke-width="1.5" />
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
              <g ref={projectsUiRef}>
                  <g className="project-card">
                    <rect x="-220" y="-50" width="200" height="120" rx="5" className="ui-bg ui-stroke" />
                    <rect x="-210" y="-40" width="180" height="70" rx="3" className="ui-fill-muted" opacity="0.3"/>
                    <text x="-210" y="45" className="project-title ui-fill-primary">Project One</text>
                    <text x="-210" y="60" className="project-desc ui-text-muted">A short description here.</text>
                  </g>
                  <g className="project-card">
                    <rect x="20" y="-50" width="200" height="120" rx="5" className="ui-bg ui-stroke" />
                    <rect x="30" y="-40" width="180" height="70" rx="3" className="ui-fill-muted" opacity="0.3"/>
                    <text x="30" y="45" className="project-title ui-fill-primary">Project Two</text>
                    <text x="30" y="60" className="project-desc ui-text-muted">Another short description.</text>
                  </g>
              </g>
            </g>

            {/* --- Creative --- */}
            <g transform="translate(300, 780)">
              <g ref={creativeUiRef}>
                  <circle cx="-60" cy="0" r="50" className="ui-fill-muted" opacity="0.1"/>
                  <path d="M 50 -50 Q 0 0 50 50" fill="none" className="ui-primary-stroke" stroke-width="2"/>
                  <rect x="-40" y="-40" width="80" height="80" rx="5" fill="none" className="ui-primary-stroke" stroke-dasharray="5 5" />
              </g>
            </g>
            
            {/* --- Contact --- */}
            <g transform="translate(300, 900)">
              <g ref={contactUiRef}>
                <text y="-35" className="contact-title ui-fill-primary">Let's build together.</text>
                <rect x="-150" y="-15" width="145" height="25" rx="4" className="contact-field ui-bg ui-stroke" stroke-width="1" />
                <text x="-140" y="2" className="contact-field-text ui-text-muted contact-field">Your Name</text>
                <rect x="5" y="-15" width="145" height="25" rx="4" className="contact-field ui-bg ui-stroke" stroke-width="1" />
                <text x="15" y="2" className="contact-field-text ui-text-muted contact-field">Your Email</text>
                <rect x="-100" y="25" width="200" height="30" rx="5" className="contact-button ui-fill-primary" />
                <text x="-25" y="44" fill="hsl(var(--primary-foreground))" font-size="9px" font-weight="600" className="contact-button">Send Message</text>
              </g>
            </g>
        </g>
        
        {/* --- FIXED UI --- */}
        <g ref={navUiRef} transform="translate(300, 50)">
              <rect x="-280" y="-15" width="560" height="30" className="ui-bg" />
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
        <g ref={footerUiRef} transform="translate(300, 1150)">
              <rect x="-280" y="-15" width="560" height="30" className="ui-bg" />
              <text x="-270" y="6" className="logo-text ui-fill-primary">KRYVE</text>
              <text x="0" y="5" font-size="8" text-anchor="middle" className="ui-text-muted">&copy; 2024. All rights reserved.</text>
              <circle cx="240" cy="5" r="6" className="ui-fill-muted" />
              <circle cx="258" cy="5" r="6" className="ui-fill-muted" />
              <circle cx="276" cy="5" r="6" className="ui-fill-muted" />
        </g>
      </g>
    </svg>
  );
}
