'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { gsap } from 'gsap';

interface MorphingSvgProps {
  theme?: string;
  isReadyToAnimate: boolean;
}

export function MorphingSvg({ theme, isReadyToAnimate }: MorphingSvgProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const scrollGroupRef = useRef<SVGGElement>(null);

  const navUiRef = useRef<SVGGElement>(null);
  const heroUiRef = useRef<SVGGElement>(null);
  const aboutUiRef = useRef<SVGGElement>(null);
  const servicesUiRef = useRef<SVGGElement>(null);
  const projectsUiRef = useRef<SVGGElement>(null);
  const processUiRef = useRef<SVGGElement>(null);
  const creativeUiRef = useRef<SVGGElement>(null);
  const contactUiRef = useRef<SVGGElement>(null);
  const footerUiRef = useRef<SVGGElement>(null);

  const sunIconRef = useRef<SVGGElement>(null);
  const moonIconRef = useRef<SVGGElement>(null);
  const heroHeadlineRef = useRef<SVGTextElement>(null);
  const heroSubtitleRef = useRef<SVGTextElement>(null);
  const servicesLinkRef = useRef<SVGTextElement>(null);
  const logoTextRef = useRef<SVGTextElement>(null);
  const messageTextRef = useRef<SVGTextElement>(null);
  const cursorRef = useRef<SVGPathElement>(null);
  
  const masterTlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!isReadyToAnimate) {
      return;
    }
    
    const svg = svgRef.current;
    if (!svg) return;
    
    if (masterTlRef.current) {
      masterTlRef.current.kill();
    }
    
    const uis = [navUiRef, heroUiRef, aboutUiRef, servicesUiRef, projectsUiRef, processUiRef, creativeUiRef, contactUiRef, footerUiRef];
    
    const colors = {
        light: {
            bg: 'hsl(0 0% 100%)',
            uiBg: 'hsl(240 4.8% 95.9%)',
            uiStroke: 'hsl(240 5.9% 90%)',
            uiFillMuted: 'hsl(240 3.8% 46.1%)',
            uiFillPrimary: 'hsl(240 10% 3.9%)',
            uiTextMuted: 'hsl(240 3.8% 46.1%)',
            primary: 'hsl(240 10% 3.9%)',
            primaryForeground: 'hsl(0 0% 98%)',
        },
        dark: {
            bg: 'hsl(240 10% 3.9%)',
            uiBg: 'hsl(240 3.7% 15.9%)',
            uiStroke: 'hsl(240 3.7% 15.9%)',
            uiFillMuted: 'hsl(240 5% 64.9%)',
            uiFillPrimary: 'hsl(0 0% 98%)',
            uiTextMuted: 'hsl(240 5% 64.9%)',
            primary: 'hsl(0 0% 98%)',
            primaryForeground: 'hsl(240 5.9% 10%)',
        }
    };

    const masterTl = gsap.timeline({
      onComplete: () => {
        const restartTl = gsap.timeline();
        const allUiElements = uis.map(r => r.current).filter(Boolean);
        
        restartTl.to(scrollGroupRef.current, { 
            y: 0, 
            duration: 1.0, 
            ease: 'power2.inOut' 
        }, 0)
        .to(allUiElements, { 
            autoAlpha: 0, 
            duration: 0.8 
        }, 0);
        
        restartTl.call(() => masterTl.restart());
      },
    });

    masterTlRef.current = masterTl;
    
    const setup = () => {
        const allUiElements = uis.map(r => r.current).filter(Boolean);
        gsap.set(allUiElements, { autoAlpha: 0 });
        if (scrollGroupRef.current) gsap.set(scrollGroupRef.current, { y: 0 });
        if (heroHeadlineRef.current) heroHeadlineRef.current.textContent = '';
        if (heroSubtitleRef.current) heroSubtitleRef.current.textContent = '';
        if (messageTextRef.current) messageTextRef.current.textContent = '';
        gsap.set(svg.querySelectorAll('.service-desc-group'), { autoAlpha: 0 });
        gsap.set(svg, { autoAlpha: 1 });
        
        const startThemeKey = theme === 'dark' ? 'dark' : 'light';
        const startTheme = colors[startThemeKey];
        
        gsap.set(svg.querySelectorAll('.main-bg'), { fill: startTheme.bg });
        gsap.set(svg.querySelectorAll('.ui-bg'), { fill: startTheme.uiBg });
        gsap.set(svg.querySelectorAll('.ui-stroke'), { stroke: startTheme.uiStroke });
        gsap.set(svg.querySelectorAll('.ui-fill-muted'), { fill: startTheme.uiFillMuted });
        gsap.set(svg.querySelectorAll('.ui-fill-primary'), { fill: startTheme.uiFillPrimary });
        gsap.set(svg.querySelectorAll('.ui-text-muted'), { fill: startTheme.uiTextMuted });
        gsap.set(svg.querySelectorAll('.ui-primary-stroke'), { stroke: startTheme.uiFillPrimary });
        gsap.set(svg.querySelectorAll('.contact-button-text'), { fill: startTheme.primaryForeground });
        if (logoTextRef.current) {
            gsap.set(logoTextRef.current, { fill: startTheme.primary });
        }
        
        if (sunIconRef.current && moonIconRef.current) {
          if(startThemeKey === 'dark') {
            gsap.set(sunIconRef.current, { autoAlpha: 0, scale: 0, rotation: -90 });
            gsap.set(moonIconRef.current, { autoAlpha: 1, scale: 1, rotation: 0 });
          } else {
            gsap.set(sunIconRef.current, { autoAlpha: 1, scale: 1, rotation: 0 });
            gsap.set(moonIconRef.current, { autoAlpha: 0, scale: 0, rotation: 90 });
          }
        }
    };

    const animateSection = (uiRef: React.RefObject<SVGGElement>) => {
      const tl = gsap.timeline();
      if (uiRef.current) {
        tl.to(uiRef.current, { autoAlpha: 1, duration: 0.1 });
      }
      return tl;
    };
    
    const headlineText = "ARTISTRY MEETS ARCHITECTURE";
    const subtitleText = "Crafting unique digital experiences.";
    const messageSampleText = "Hello!";

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

    masterTl.add(setup);
    
    masterTl.add(animateSection(navUiRef), "+=0.2");
    masterTl.add(animateSection(heroUiRef), "+=0.1");
    masterTl.add(typeText(heroHeadlineRef, headlineText, 0.8), "+=0.2");
    masterTl.add(typeText(heroSubtitleRef, subtitleText, 0.8), "+=0.2");

    const aboutTl = gsap.timeline();
    if (aboutUiRef.current) {
        const image = aboutUiRef.current.querySelector('.about-image');
        const textLines = aboutUiRef.current.querySelectorAll('.about-text-line');
        aboutTl.add(animateSection(aboutUiRef));
        if (image && textLines) {
            aboutTl.fromTo(image, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, ease: 'power2.out', duration: 0.5 }, '>-0.2');
            aboutTl.fromTo(textLines, { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, stagger: 0.1, ease: 'power2.out', duration: 0.4 }, '>-0.3');
        }
    }
    masterTl.add(aboutTl, '+=0.5');

    const toggleTl = gsap.timeline();
    const startTheme = theme === 'dark' ? 'dark' : 'light';
    const targetTheme = startTheme === 'dark' ? 'light' : 'dark';
    const toColors = colors[targetTheme];
    
    if (sunIconRef.current && moonIconRef.current) {
        const sunState = { scale: 1, rotation: 0, autoAlpha: 1 };
        const moonState = { scale: 0, rotation: -90, autoAlpha: 0 };
        if (startTheme === 'dark') {
          [sunState.scale, moonState.scale] = [moonState.scale, sunState.scale];
          [sunState.rotation, moonState.rotation] = [moonState.rotation, sunState.rotation];
          [sunState.autoAlpha, moonState.autoAlpha] = [moonState.autoAlpha, sunState.autoAlpha];
        }
        toggleTl.to(sunIconRef.current, { scale: moonState.scale, rotation: moonState.rotation, autoAlpha: moonState.autoAlpha, ease: 'power2.in', duration: 0.4 })
                .to(moonIconRef.current, { scale: sunState.scale, rotation: sunState.rotation, autoAlpha: sunState.autoAlpha, ease: 'power2.out', duration: 0.4 }, '>-0.3');
    }

    toggleTl.to(svg.querySelectorAll('.main-bg'), { fill: toColors.bg, duration: 0.6 }, '<')
            .to(svg.querySelectorAll('.ui-bg'), { fill: toColors.uiBg, duration: 0.6 }, '<')
            .to(svg.querySelectorAll('.ui-stroke'), { stroke: toColors.uiStroke, duration: 0.6 }, '<')
            .to(svg.querySelectorAll('.ui-fill-muted'), { fill: toColors.uiFillMuted, duration: 0.6 }, '<')
            .to(svg.querySelectorAll('.ui-fill-primary'), { fill: toColors.uiFillPrimary, duration: 0.6 }, '<')
            .to(svg.querySelectorAll('.ui-text-muted'), { fill: toColors.uiTextMuted, duration: 0.6 }, '<')
            .to(svg.querySelectorAll('.ui-primary-stroke'), { stroke: toColors.uiFillPrimary, duration: 0.6 }, '<')
            .to(svg.querySelectorAll('.contact-button-text'), { fill: toColors.primaryForeground, duration: 0.6 }, '<');

    if (logoTextRef.current) {
      toggleTl.to(logoTextRef.current, { fill: toColors.primary, duration: 0.6 }, '<');
    }
    masterTl.add(toggleTl, '+=0.6');

    const sequenceTl = gsap.timeline();
    const servicesTl = gsap.timeline();
    if (servicesUiRef.current) {
        const cards = servicesUiRef.current.querySelectorAll('.service-card');
        servicesTl.add(animateSection(servicesUiRef));
        if (cards.length > 0) {
            servicesTl.fromTo(cards, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, stagger: 0.15, ease: 'power2.out', duration: 0.4 }, '>-0.2');
        }
    }

    const projectsTl = gsap.timeline();
    if (projectsUiRef.current) {
        const projectCards = projectsUiRef.current.querySelectorAll('.project-card');
        projectsTl.add(animateSection(projectsUiRef));
        if (projectCards.length > 0) {
            projectsTl.fromTo(projectCards, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, stagger: 0.15, ease: 'power2.out', duration: 0.4 } );
            projectsTl.fromTo(projectsUiRef.current.querySelectorAll('.project-image-placeholder'), { autoAlpha: 0 }, { autoAlpha: 1, stagger: 0.15, duration: 0.3}, '>-0.4');
            projectsTl.fromTo(projectsUiRef.current.querySelectorAll('.project-text-line'), { autoAlpha: 0, x: -5 }, { autoAlpha: 1, x: 0, stagger: 0.05, duration: 0.3}, '>-0.3');
        }
    }
    
    const processTl = gsap.timeline();
    if (processUiRef.current) {
        const title = processUiRef.current.querySelector('text');
        const steps = processUiRef.current.querySelectorAll('.process-step');
        const arrows = Array.from(processUiRef.current.querySelectorAll('.process-arrow'));
        processTl.add(animateSection(processUiRef));
        if (title) {
            processTl.from(title, { autoAlpha: 0, y: -10, duration: 0.3 }, ">-0.2");
        }
        if (steps.length) {
            processTl.from(steps, { autoAlpha: 0, scale: 0.8, stagger: 0.2, duration: 0.4 });
        }
        if (arrows.length) {
            arrows.forEach(arrow => {
                const length = arrow.getTotalLength();
                gsap.set(arrow, {strokeDasharray: length, strokeDashoffset: length, autoAlpha: 1});
            });
            processTl.to(arrows, { strokeDashoffset: 0, duration: 0.4, stagger: 0.2 }, ">-1.0");
        }
    }

    const creativeTl = gsap.timeline();
    if (creativeUiRef.current) {
        creativeTl.add(animateSection(creativeUiRef));
        creativeTl.from(creativeUiRef.current.children, { scale: 0.8, autoAlpha: 0, stagger: 0.1, transformOrigin: 'center', duration: 0.4 }, '>-0.2');
    }

    const contactTl = gsap.timeline();
    if (contactUiRef.current) {
        const fields = contactUiRef.current.querySelectorAll('.contact-field');
        const button = contactUiRef.current.querySelector('.contact-button');
        contactTl.add(animateSection(contactUiRef));
        contactTl.from(fields, { autoAlpha: 0, x: -15, stagger: 0.15, duration: 0.3 }, '>-0.2');
        if (cursorRef.current && messageTextRef.current) {
            gsap.set(cursorRef.current, {autoAlpha: 0});
            contactTl.to(cursorRef.current, {autoAlpha: 1, duration: 0.1})
                     .to(cursorRef.current, {autoAlpha: 0, repeat: 3, yoyo: true, duration: 0.3, repeatDelay: 0.1})
                     .add(typeText(messageTextRef, messageSampleText, 0.5))
                     .to(cursorRef.current, {autoAlpha: 0, duration: 0.1});
        }
        contactTl.from(button, { autoAlpha: 0, scale: 0.8, duration: 0.3 }, '>-0.1');
    }
    
    sequenceTl.add(servicesTl)
              .add(projectsTl, '>-0.3')
              .add(processTl, '>-0.2')
              .add(creativeTl, '>-0.2')
              .add(contactTl, '>-0.2')
              .add(animateSection(footerUiRef), '>-0.2');

    masterTl.add(sequenceTl, '+=0.4');
    
    masterTl.addLabel('interact', "+=0.8");

    const servicesClickTl = gsap.timeline();
    if (servicesLinkRef.current) {
        const activeColor = toColors.uiFillPrimary;
        servicesClickTl.to(servicesLinkRef.current, { fill: activeColor, duration: 0.2 })
                       .to(servicesLinkRef.current, { scale: 1.1, transformOrigin: 'center middle', duration: 0.2, yoyo: true, repeat: 1 });
    }
    masterTl.add(servicesClickTl, 'interact');
    
    if (scrollGroupRef.current) {
        masterTl.to(scrollGroupRef.current, { y: -350, duration: 1.2, ease: 'power3.inOut' }, 'interact+=0.1');
        masterTl.fromTo(svg.querySelectorAll('.service-desc-group'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, stagger: 0.15, ease: 'power2.out', duration: 0.5 }, '>-0.6');
    }
    
    masterTl.to({}, { duration: 2.5 });

    return () => {
      if (masterTlRef.current) {
        masterTlRef.current.kill();
      }
    };

  }, [theme, isReadyToAnimate]);

  return (
    <svg ref={svgRef} viewBox="0 0 600 1200" preserveAspectRatio="xMidYMin slice" className="h-full w-full opacity-0">
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
            .contact-message-text { font-size: 9px; }
            .contact-button-text { font-size: 9px; font-weight: 600; text-anchor: middle; }
          `}
        </style>
        <clipPath id="mainClip">
          <rect x="20" y="20" width="560" height="1160" rx="10" />
        </clipPath>
      </defs>
      
      <rect x="20" y="20" width="560" height="1160" rx="10" className="main-bg"/>
      
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
                      <rect x="-190" y="-40" width="140" height="100" rx="5" className="ui-bg ui-stroke" strokeWidth="1"/>
                      <path d="M -180 45 l 20 -20 l 25 25 l 30 -35 l 35 40" fill="none" className="ui-primary-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="-165" cy="-20" r="8" className="ui-fill-primary" opacity="0.5"/>
                  </g>
                  <g className="about-text">
                      <text x="-20" y="-30" className="about-title ui-fill-primary about-text-line" >Our Philosophy</text>
                      <text x="-20" y="-10" className="about-text ui-text-muted about-text-line" >We believe in design that solves</text>
                      <text x="-20" y="2" className="about-text ui-text-muted about-text-line" >problems and code that feels</text>
                      <text x="-20" y="14" className="about-text ui-text-muted about-text-line">like magic.</text>
                      <rect x="-20" y="35" width="80" height="12" rx="3" className="about-text-line ui-fill-primary" />
                  </g>
              </g>
          </g>

          {/* --- Services --- */}
          <g transform="translate(300, 450)">
              <g ref={servicesUiRef}>
                  <g className="service-card" transform="translate(-160, 0)">
                      <rect x="-70" y="-40" width="140" height="90" rx="5" className="ui-bg ui-stroke" strokeWidth="1" />
                      <path d="M -57 -28 l -3 3 h 26 l -3 -3 M -44 -28 v -5 M -44 -18 v -5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" className="ui-primary-stroke" transform="scale(0.4) translate(-45, -45)" />
                      <text x="-60" y="-5" className="service-title ui-fill-primary">Web Design</text>
                      <g className="service-desc-group">
                        <text x="-60" y="10" className="service-desc ui-text-muted">Visually stunning</text>
                        <text x="-60" y="20" className="service-desc ui-text-muted">interfaces.</text>
                      </g>
                  </g>
                  <g className="service-card" transform="translate(0, 0)">
                      <rect x="-70" y="-40" width="140" height="90" rx="5" className="ui-bg ui-stroke" strokeWidth="1" />
                      <path d="M-52 -25 l-8 5 l8 5 M-44 -25 l8 5 l-8 5" fill="none" className="ui-primary-stroke" strokeWidth="1.5" strokeLinecap="round" transform="scale(0.4) translate(-45, -42)" />
                      <text x="-60" y="-5" className="service-title ui-fill-primary">Development</text>
                      <g className="service-desc-group">
                        <text x="-60" y="10" className="service-desc ui-text-muted">Robust & Scalable</text>
                        <text x="-60" y="20" className="service-desc ui-text-muted">solutions.</text>
                      </g>
                  </g>
                  <g className="service-card" transform="translate(160, 0)">
                      <rect x="-70" y="-40" width="140" height="90" rx="5" className="ui-bg ui-stroke" strokeWidth="1" />
                      <path d="M-52 -22 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 M-44 -22 l0 -8 l8 4 z" fill="none" className="ui-primary-stroke" strokeWidth="1.5" transform="scale(0.4) translate(-45, -42)" />
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
                <g className="project-card" transform="translate(-115, 0)">
                  <rect x="-105" y="-50" width="210" height="120" rx="5" className="ui-bg ui-stroke" strokeWidth="1"/>
                  <g className="project-image-placeholder">
                    <rect x="-95" y="-40" width="190" height="70" rx="3" className="ui-fill-muted" opacity="0.3"/>
                    <path d="M-85 -20 l 20 20 l 30 -15 l 40 25" fill="none" className="ui-primary-stroke" strokeWidth="1" opacity="0.5"/>
                    <circle cx="-75" cy="-30" r="5" fill="none" className="ui-primary-stroke" strokeWidth="1" opacity="0.5"/>
                  </g>
                  <text x="-95" y="45" className="project-title ui-fill-primary project-text-line">Project One</text>
                  <text x="-95" y="60" className="project-desc ui-text-muted project-text-line">A short description here.</text>
                </g>
                <g className="project-card" transform="translate(115, 0)">
                  <rect x="-105" y="-50" width="210" height="120" rx="5" className="ui-bg ui-stroke" strokeWidth="1"/>
                   <g className="project-image-placeholder">
                    <rect x="-95" y="-40" width="190" height="70" rx="3" className="ui-fill-muted" opacity="0.3"/>
                    <path d="M-85 -20 l 20 20 l 30 -15 l 40 25" fill="none" className="ui-primary-stroke" strokeWidth="1" opacity="0.5"/>
                    <circle cx="-75" cy="-30" r="5" fill="none" className="ui-primary-stroke" strokeWidth="1" opacity="0.5"/>
                  </g>
                  <text x="-95" y="45" className="project-title ui-fill-primary project-text-line">Project Two</text>
                  <text x="-95" y="60" className="project-desc ui-text-muted project-text-line">Another short description.</text>
                </g>
            </g>
          </g>

          {/* --- Process --- */}
            <g ref={processUiRef} transform="translate(300, 780)">
                <text y="-35" className="about-title ui-fill-primary" textAnchor="middle">Our Process</text>
                
                <g className="process-step" transform="translate(-180, 0)">
                    <circle r="15" className="ui-bg ui-stroke" strokeWidth="1"/>
                    <circle cx="-3" cy="-3" r="5" fill="none" className="ui-primary-stroke" strokeWidth="1.5"/>
                    <line x1="0" y1="0" x2="6" y2="6" className="ui-primary-stroke" strokeWidth="1.5" strokeLinecap="round"/>
                    <text y="30" textAnchor="middle" className="service-desc ui-text-muted">Discover</text>
                </g>
                <path className="process-arrow" d="M -155 0 h 50" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1"/>

                <g className="process-step" transform="translate(-70, 0)">
                    <circle r="15" className="ui-bg ui-stroke" strokeWidth="1"/>
                    <path d="M-5 5 L5 -5 M-5 -5 L-2.5 -7.5 L7.5 2.5 L5 5" fill="none" className="ui-primary-stroke" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
                    <text y="30" textAnchor="middle" className="service-desc ui-text-muted">Design</text>
                </g>
                <path className="process-arrow" d="M -45 0 h 50" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1"/>

                <g className="process-step" transform="translate(40, 0)">
                    <circle r="15" className="ui-bg ui-stroke" strokeWidth="1"/>
                    <path d="M-6 -5L-2 0l-4 5 M6 -5L2 0l4 5" fill="none" className="ui-primary-stroke" strokeWidth="1.5" strokeLinecap="round"/>
                    <text y="30" textAnchor="middle" className="service-desc ui-text-muted">Develop</text>
                </g>
                <path className="process-arrow" d="M 65 0 h 50" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1"/>

                <g className="process-step" transform="translate(150, 0)">
                    <circle r="15" className="ui-bg ui-stroke" strokeWidth="1"/>
                    <path d="M0 -8L5 3L-5 3Z M-3 6L3 6" fill="none" className="ui-primary-stroke" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M-5 -2 C -2 -8, 2 -8, 5 -2" fill="none" className="ui-primary-stroke" strokeWidth="1.5" strokeLinecap="round" />
                    <text y="30" textAnchor="middle" className="service-desc ui-text-muted">Deploy</text>
                </g>
            </g>

          {/* --- Creative --- */}
          <g transform="translate(300, 920)">
            <g ref={creativeUiRef}>
                <circle cx="-60" cy="0" r="50" className="ui-fill-muted" opacity="0.1"/>
                <path d="M 50 -50 Q 0 0 50 50" fill="none" className="ui-primary-stroke" strokeWidth="2"/>
                <rect x="-40" y="-40" width="80" height="80" rx="5" fill="none" className="ui-primary-stroke" strokeDasharray="5 5" />
            </g>
          </g>
          
          {/* --- Contact --- */}
          <g transform="translate(300, 1050)">
            <g ref={contactUiRef}>
              <text y="-35" className="contact-title ui-fill-primary">Let's build together.</text>
              <rect x="-150" y="-15" width="145" height="25" rx="4" className="contact-field ui-bg ui-stroke" strokeWidth="1" />
              <text x="-140" y="2" className="contact-field-text ui-text-muted contact-field">Your Name</text>
              <rect x="5" y="-15" width="145" height="25" rx="4" className="contact-field ui-bg ui-stroke" strokeWidth="1" />
              <text x="15" y="2" className="contact-field-text ui-text-muted contact-field">Your Email</text>
              <rect x="-150" y="20" width="300" height="40" rx="4" className="contact-field ui-bg ui-stroke" strokeWidth="1" />
              <text x="-140" y="38" className="contact-field-text ui-text-muted contact-field">Your Message</text>
              <text ref={messageTextRef} x="-140" y="50" className="contact-message-text ui-fill-primary" />
              <path ref={cursorRef} d="M-140 38 v 12" className="ui-primary-stroke" strokeWidth="1" strokeLinecap="round" />
              <rect x="-100" y="75" width="200" height="30" rx="5" className="contact-button ui-fill-primary" />
              <text x="0" y="94" className="contact-button-text">Send Message</text>
            </g>
          </g>
        </g>
        
        {/* --- FIXED Navbar --- */}
        <g ref={navUiRef} transform="translate(300, 50)">
          <rect x="-280" y="-15" width="560" height="30" className="ui-bg" />
          <text ref={logoTextRef} x="-270" y="6" className="logo-text">KRYVE</text>
          <text x="-50" y="5.5" className="nav-link ui-text-muted">About</text>
          <text ref={servicesLinkRef} x="20" y="5.5" className="nav-link ui-text-muted">Services</text>
          <text x="90" y="5.5" className="nav-link ui-text-muted">Work</text>
          <g transform="translate(235, -7)" style={{ cursor: 'pointer' }}>
            <g ref={sunIconRef}>
                <circle cx="7" cy="7" r="2.5" fill="none" className="ui-primary-stroke" strokeWidth="1.2"/>
                <path d="M7 1V3 M7 11V13 M2.64 2.64L3.35 3.35 M10.65 10.65L11.36 11.36 M1 7H3 M11 7H13 M2.64 11.36L3.35 10.65 M10.65 3.35L11.36 2.64"
                      className="ui-primary-stroke" strokeWidth="1.2" strokeLinecap="round" />
            </g>
            <g ref={moonIconRef}>
                <path d="M10 2.5 A5.5 5.5 0 0 1 2.5 10 A4 4 0 0 0 10 2.5z" className="ui-fill-primary"/>
            </g>
          </g>
        </g>
        
        {/* --- FIXED Footer --- */}
        <g ref={footerUiRef} transform="translate(300, 1150)">
          <rect x="-280" y="-15" width="560" height="30" className="ui-bg" />
          <text x="-270" y="6" className="logo-text ui-fill-primary">KRYVE</text>
          <text x="0" y="5" fontSize="8" textAnchor="middle" className="ui-text-muted">&copy; 2024. All rights reserved.</text>
          <circle cx="240" cy="5" r="6" className="ui-fill-muted" />
          <circle cx="258" cy="5" r="6" className="ui-fill-muted" />
          <circle cx="276" cy="5" r="6" className="ui-fill-muted" />
        </g>
      </g>
      <rect x="20" y="20" width="560" height="1160" rx="10" fill="none" className="ui-stroke" strokeWidth="2"/>
    </svg>
  );
}

    