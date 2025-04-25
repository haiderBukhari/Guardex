"use client";

import { useEffect, useRef, useState, memo } from "react";
import {
  LazyMotion,
  domMax,
  motion,
  useInView,
  useAnimation,
  useScroll,
  useTransform,
  useSpring,
  type Variants,
  AnimatePresence,
} from "framer-motion";
import {
  Globe,
  Bug as Spider,
  ShieldAlert,
  Brain,
  BarChart3,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Submit a URL",
    description:
      "Enter any website or application URL you want to scan. No account setup needed to get started.",
    icon: Globe,
    color: "from-blue-500 to-cyan-400",
    details:
      "Our scanner accepts any public URL and doesn't require authentication. You can scan websites, web applications, APIs, and more without creating an account or providing any personal information.",
  },
  {
    number: 2,
    title: "Smart Crawler Activates",
    description:
      "Our intelligent crawler maps your entire application, discovering pages, forms, APIs and interactive elements.",
    icon: Spider,
    color: "from-indigo-500 to-purple-500",
    details:
      "The crawler uses advanced techniques to discover all accessible endpoints, form inputs, and interactive elements. It intelligently follows links, submits forms with safe test data, and maps the entire structure of your application.",
  },
  {
    number: 3,
    title: "Vulnerability Checks Run",
    description:
      "We test for 100+ vulnerability types including OWASP Top 10, custom injection attacks, and misconfigurations.",
    icon: ShieldAlert,
    color: "from-red-500 to-orange-400",
    details:
      "Our comprehensive security checks cover SQL injection, XSS, CSRF, broken authentication, sensitive data exposure, XML external entities, security misconfigurations, and many more vulnerability types that could put your application at risk.",
  },
  {
    number: 4,
    title: "AI Analysis & Prioritization",
    description:
      "Our AI explains each finding in plain English, prioritizes issues, and suggests custom code fixes.",
    icon: Brain,
    color: "from-emerald-500 to-teal-400",
    details:
      "Our advanced AI engine analyzes each vulnerability in context, determines its severity based on multiple factors, and provides clear explanations of the risk. It then generates custom code fixes tailored to your specific technology stack.",
  },
  {
    number: 5,
    title: "Results in Real-Time",
    description:
      "Watch results appear as they're found in your interactive dashboard. Export, share, and start fixing immediately.",
    icon: BarChart3,
    color: "from-violet-500 to-fuchsia-400",
    details:
      "The interactive dashboard updates in real-time as vulnerabilities are discovered. You can filter results, export reports in multiple formats, share findings with your team, and track remediation progress all from one central location.",
  },
];

// Floating animation for background elements
const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 6,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "reverse" as const,
      ease: "easeInOut",
    },
  },
};

// Staggered container animation
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Item slide-in animation
const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

// Particle component for hover effects
const Particle = ({ color }: { color: string }) => {
  return (
    <motion.div
      className={`absolute size-1 rounded-full bg-gradient-to-br ${color} opacity-70`}
      initial={{ scale: 0 }}
      animate={{
        scale: [0, 1, 0],
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
      }}
      transition={{ duration: 1.5 }}
    />
  );
};

const StepCard = memo(({ step, index }: { step: (typeof steps)[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });
  const controls = useAnimation();
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = step.icon;

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={cardRef}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group"
    >
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${step.color} rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow`}></div>
      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
              <span className="text-sm font-medium text-gray-500">Step {step.number}</span>
            </div>
            <p className="mt-2 text-gray-600">{step.description}</p>
            
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-4 flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{isExpanded ? "Show less" : "Learn more"}</span>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="ml-1"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 text-sm text-gray-500"
                >
                  {step.details}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

const HowItWorksSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  const controls = useAnimation();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const smoothYProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const scrollWidth = useTransform(smoothYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <LazyMotion features={domMax}>
      <section id="how-it-works" className="py-24 relative overflow-hidden">
        <motion.div
          className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-blue-500/5 blur-xl"
          variants={floatingAnimation}
          initial="initial"
          animate="animate"
        />
        <motion.div
          className="absolute bottom-20 right-[10%] w-80 h-80 rounded-full bg-purple-500/5 blur-xl"
          variants={floatingAnimation}
          initial="initial"
          animate="animate"
          transition={{ delay: 1 }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05)_0%,rgba(255,255,255,0)_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.08)_0%,rgba(255,255,255,0)_60%)]" />

        <motion.div
          className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 z-50"
          style={{ width: scrollWidth, willChange: 'transform, opacity' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto mb-16 text-center"
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-sm font-medium mb-6"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse mr-2"></span>
              How It Works
            </motion.div>
            <motion.h2
              className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 via-purple-800 to-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Simple, Powerful Security Scanning
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Our process is designed to be simple yet comprehensive, giving you the security insights you need without the complexity.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto" ref={containerRef}>
            {steps.map((step, index) => (
              <StepCard key={step.number} step={step} index={index} />
            ))}
          </div>
        </div>
      </section>
    </LazyMotion>
  );
};

export default HowItWorksSection;
