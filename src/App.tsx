/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, MouseEvent } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  Youtube, 
  ExternalLink, 
  Code2, 
  Palette, 
  Terminal, 
  Cpu, 
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Play
} from 'lucide-react';

// --- Types ---
type Page = 'home' | 'projects' | 'contact';

interface Skill {
  name: string;
  level: number;
  category: string;
}

interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  images: string[];
  videoUrl: string;
  prototypeUrl: string;
}

// --- Data ---
const SKILLS: Skill[] = [
  { name: 'Unity', level: 95, category: 'Game dev' },
  { name: 'Unreal', level: 50, category: 'Game dev' },
  { name: 'Blender', level: 60, category: '3D modeling' },
  { name: 'Canva', level: 85, category: 'Graphic design' },
  { name: 'Git / GitHub', level: 92, category: 'Version control' },
  { name: 'Digital marketing', level: 75, category: 'Marketing' },
  { name: 'Video editing', level: 75, category: 'Marketing' }
];

const EXPERIENCE: Experience[] = [
  {
     title: 'Game design intern',
    company: 'Yajoura games',
    period: 'july 2024 - August 2024',
    description: 'Problem solving in game marketing context + made proof of concept of a tunisian music card game.'
  },
  {
   title: 'IT maintenance intern',
    company: 'Compangnie de phosphate Gafsa (CPG) ',
    period: 'August 2022',
    description: 'Learned how IT work actually goes in a real company and learned computer maintenance'
  },
  
];

const PROJECTS: Project[] = [
  {
    id: 1,
    name: 'Creatures (PFE game)',
    description: 'A game My teammate and I have made during our final year at ISAMM , an action-adventure game with shapeshifting mechanics',
    images: ['public/Picture2.png'],
    videoUrl: 'https://www.youtube.com/embed/wmpYWJrmVjA', // Placeholder
    prototypeUrl: 'https://drive.google.com/drive/folders/1pw01koZsmOj3uVqeJSzzELcRaKNZwGKG?usp=drive_link'
  },
  {
    id: 2,
    name: 'Bubble brawl (GGJ 2025)',
    description: 'GGJ 2025 submission , This game features bubble butt kicking , fun for Duos trying to duke it out bubble style!.',
    images: ['public/game_menu_background.jpg'],
    videoUrl: 'https://youtube.com/embed/wzsO8o1S94g', // Placeholder
    prototypeUrl: 'https://ggjv4.s3.us-west-1.amazonaws.com/files/games/2025/828780/exec/Ramdal%20Games%20GGJ%20Build_0.7z?VersionId=A9CcOacIZeUjM09ypSZolDK_EX74ub6l'
  }
];

// --- Components ---

const Navbar = ({ currentPage, setPage }: { currentPage: Page, setPage: (p: Page) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks: { label: string, value: Page }[] = [
    { label: 'Home', value: 'home' },
    { label: 'Projects', value: 'projects' },
    { label: 'Contact', value: 'contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-bg-dark/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-display font-bold gradient-text cursor-pointer"
          onClick={() => setPage('home')}
        >
          PORTFOLIO.
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.value}
              onClick={() => setPage(link.value)}
              className={`text-sm font-medium transition-colors hover:text-accent-blue ${
                currentPage === link.value ? 'text-accent-blue' : 'text-gray-400'
              }`}
            >
              {link.label}
              {currentPage === link.value && (
                <motion.div 
                  layoutId="nav-underline"
                  className="h-0.5 bg-accent-blue mt-1 rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-gray-100" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-bg-dark border-b border-white/5 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.value}
                  onClick={() => {
                    setPage(link.value);
                    setIsOpen(false);
                  }}
                  className={`text-left text-lg font-medium ${
                    currentPage === link.value ? 'text-accent-blue' : 'text-gray-400'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Typewriter = ({ texts }: { texts: string[] }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === texts[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 2000);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % texts.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 75 : 150);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, texts]);

  return (
    <span className="typewriter text-accent-blue font-mono">
      {texts[index].substring(0, subIndex)}
    </span>
  );
};

const HomePage = ({ setPage }: { setPage: (p: Page) => void }) => {
  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative mb-12"
        >
          <div className="gradient-border w-48 h-48 md:w-64 md:h-64 p-1">
            <div className="w-full h-full rounded-full overflow-hidden bg-bg-dark flex items-center justify-center relative">
              <img 
                src="public/Ahmed.jpg" 
                alt="Profile" 
                className="w-full h-full object-cover opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/60 to-transparent" />
            </div>
          </div>
          <div className="absolute -inset-4 bg-accent-blue/20 blur-3xl rounded-full -z-10 animate-pulse" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-8xl font-display font-black mb-4"
        >
          Ahmed <span className="gradient-text">Elyaakoubi</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-3xl text-gray-400 mb-8 h-10"
        >
          I am a <Typewriter texts={['Developer', 'Marketer', 'Gamer']} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-2xl text-gray-400 text-lg md:text-xl mb-12 leading-relaxed"
        >
          Creating and Crafting masterpieces , one line of code at a time ":)"
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPage('projects')}
          className="px-8 py-4 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full font-bold text-lg flex items-center gap-2 shadow-lg shadow-accent-blue/20"
        >
          See My Work <ChevronRight size={20} />
        </motion.button>
      </section>

      {/* Skills Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl mb-4">My <span className="gradient-text">Skills</span></h2>
          <p className="text-gray-400 max-w-xl mx-auto">A collection of technologies and tools I've mastered over the years.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SKILLS.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 hover:bg-white/10 transition-colors group"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-mono text-accent-blue uppercase tracking-widest">{skill.category}</span>
                <span className="text-sm font-bold">{skill.level}%</span>
              </div>
              <h3 className="text-xl mb-4">{skill.name}</h3>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-accent-blue to-accent-purple"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl mb-4">My <span className="gradient-text">Experience</span></h2>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-white/10 -translate-x-1/2" />

          {EXPERIENCE.map((exp, i) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`relative mb-12 pl-12 md:pl-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right md:ml-0' : 'md:pl-12 md:ml-auto'}`}
            >
              {/* Dot */}
              <div className={`absolute top-2 w-4 h-4 bg-accent-blue rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] z-10
                left-[7px] md:left-auto
                ${i % 2 === 0 ? 'md:right-[-9px]' : 'md:left-[-9px]'}`} 
              />
              
              <div className="glass-card p-6">
                <span className="text-accent-blue font-mono text-sm mb-2 block">{exp.period}</span>
                <h3 className="text-2xl mb-1">{exp.title}</h3>
                <h4 className="text-gray-400 font-medium mb-4">{exp.company}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{exp.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

const ProjectSlideshow = ({ images, name }: { images: string[], name: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = (e: MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = (e: MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) return null;

  return (
    <div className="relative aspect-video overflow-hidden group/slideshow">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${name} screenshot ${currentIndex + 1}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover/slideshow:opacity-100 transition-opacity hover:bg-black/60 z-20"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover/slideshow:opacity-100 transition-opacity hover:bg-black/60 z-20"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {images.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === currentIndex ? 'bg-accent-blue' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </>
      )}
      
      <div className="absolute inset-0 bg-bg-dark/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
          <Play fill="currentColor" size={20} />
        </div>
      </div>
    </div>
  );
};

const ProjectsPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <h2 className="text-5xl md:text-7xl mb-4">My <span className="gradient-text">Projects</span></h2>
        <p className="text-gray-400 max-w-2xl mx-auto">These are my best projects , made with love for the game and solid teamwork </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROJECTS.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -10 }}
            className="glass-card overflow-hidden group"
          >
            <ProjectSlideshow images={project.images} name={project.name} />
            
            <div className="p-8">
              <h3 className="text-2xl mb-4">{project.name}</h3>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                {project.description}
              </p>
              
              <div className="space-y-4">
                <div className="aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/5">
                  <iframe
                    width="100%"
                    height="100%"
                    src={project.videoUrl}
                    title={project.name}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                
                <a 
                  href={project.prototypeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  View Prototype <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ContactPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 100, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/10 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            x: [0, -100, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/10 blur-[120px] rounded-full"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h2 className="text-5xl md:text-7xl mb-4">Get In <span className="gradient-text">Touch</span></h2>
        <p className="text-gray-400 max-w-xl mx-auto">Have a project in mind or just want to say hello? I'd love to hear from you.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {[
          { icon: <Phone />, label: 'Phone Number', value: '+216 27861705', href: 'tel:+21627861705' },
          { icon: <Mail />, label: 'Email Address', value: 'ahmedchihi00@gmail.com', href: 'mailto:ahmedchihi00@gmail.com' },
          { icon: <Youtube />, label: 'YouTube Channel', value: 'My YouTube Channel (check out my video editing)', href: 'https://www.youtube.com/@ahmed8743ify' },
          { icon: <Github />, label: 'Github', value: 'My Github repo for my other projects', href: 'https://github.com/Ahmed-yacoubi5' }
        ].map((item, i) => (
          <motion.a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="glass-card p-8 flex flex-col items-center text-center group"
          >
            <div className="w-16 h-16 rounded-2xl bg-accent-blue/10 flex items-center justify-center text-accent-blue mb-6 group-hover:bg-accent-blue group-hover:text-white transition-colors">
              {item.icon}
            </div>
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">{item.label}</span>
            <span className="text-xl font-bold">{item.value}</span>
          </motion.a>
        ))}
      </div>

      <footer className="mt-32 text-gray-500 text-sm font-mono">
        © 2025 Ahmed Elyaakoubi. All rights reserved.
      </footer>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [page, setPage] = useState<Page>('home');

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <div className="min-h-screen">
      <Navbar currentPage={page} setPage={setPage} />
      
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {page === 'home' && <HomePage setPage={setPage} />}
            {page === 'projects' && <ProjectsPage />}
            {page === 'contact' && <ContactPage />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
