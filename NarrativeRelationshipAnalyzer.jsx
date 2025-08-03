import React, { useState, useEffect, useRef } from 'react';
import { Heart, Brain, Users, BookOpen, ArrowRight, ArrowLeft, Sparkles, TrendingUp, FileText, RefreshCw } from 'lucide-react';

const NarrativeRelationshipAnalyzer = () => {
  const canvasRef = useRef(null);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [narratives, setNarratives] = useState({
    earlyBonding: '',
    challenges: '',
    currentState: ''
  });
  const [analysis, setAnalysis] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const phases = [
    {
      id: 'earlyBonding',
      title: 'Early Bonding & Foundation',
      subtitle: 'The Beginning of Your Connection',
      prompts: [
        "How did you first meet and what drew you to this person?",
        "Tell us about an early moment when you felt a genuine connection.",
        "Describe a time when you first trusted this person with something important.",
        "What shared experiences or interests brought you closer together?",
        "How did you communicate in the early days of your relationship?"
      ],
      placeholder: "Share the story of how your relationship began. What were those early moments like? How did trust develop? What made you feel connected to this person?",
      color: 'from-green-400 to-blue-500'
    },
    {
      id: 'challenges',
      title: 'Challenges & Growth',
      subtitle: 'Navigating Difficulties Together',
      prompts: [
        "Describe a significant challenge or conflict you faced together.",
        "Tell us about a time when you disappointed each other and how you handled it.",
        "How do you typically resolve disagreements or misunderstandings?",
        "Share a moment when this relationship was tested by external circumstances.",
        "Describe a time when you had to support each other through difficulty."
      ],
      placeholder: "Every meaningful relationship faces challenges. Tell us about the difficulties you've navigated together, how you've grown from conflicts, and what you've learned about each other during tough times.",
      color: 'from-orange-400 to-red-500'
    },
    {
      id: 'currentState',
      title: 'Current State & Future',
      subtitle: 'Where You Are Now',
      prompts: [
        "How would you describe your relationship today?",
        "What does this person mean to you now?",
        "Tell us about a recent moment that reminded you why this relationship matters.",
        "How do you support each other in your current life situations?",
        "What hopes do you have for this relationship moving forward?"
      ],
      placeholder: "Reflect on where your relationship stands today. How has it evolved? What role does this person play in your life now? What does the future hold for your connection?",
      color: 'from-purple-400 to-pink-500'
    }
  ];

  // Neurochemical pathway definitions
  const pathwayTypes = {
    oxytocin: { color: '#ff6b6b', name: 'Oxytocin (Trust & Bonding)' },
    dopamine: { color: '#4ecdc4', name: 'Dopamine (Reward & Joy)' },
    serotonin: { color: '#45b7d1', name: 'Serotonin (Emotional Regulation)' },
    endorphin: { color: '#96ceb4', name: 'Endorphin (Comfort & Relief)' }
  };

  // Advanced narrative analysis function
  const analyzeNarrative = (narratives) => {
    const { earlyBonding, challenges, currentState } = narratives;
    
    // Emotional keywords and their neurochemical associations
    const emotionalMarkers = {
      oxytocin: {
        positive: ['trust', 'safe', 'comfort', 'secure', 'reliable', 'loyal', 'devoted', 'committed', 'intimate', 'close', 'bonded', 'attached', 'connected', 'understanding', 'accepted', 'belonged'],
        negative: ['betrayed', 'abandoned', 'rejected', 'isolated', 'distant', 'disconnected', 'untrusting', 'suspicious']
      },
      dopamine: {
        positive: ['excited', 'thrilled', 'happy', 'joyful', 'fun', 'adventure', 'celebrate', 'amazing', 'wonderful', 'fantastic', 'delighted', 'pleased', 'enthusiastic', 'motivated', 'inspired', 'accomplished'],
        negative: ['bored', 'disappointed', 'unfulfilled', 'monotonous', 'routine', 'stagnant', 'uninspired']
      },
      serotonin: {
        positive: ['calm', 'peaceful', 'balanced', 'harmonious', 'resolved', 'understood', 'communication', 'discussed', 'talked', 'listened', 'compromise', 'agreement', 'patient', 'stable'],
        negative: ['anxious', 'stressed', 'overwhelmed', 'chaotic', 'unresolved', 'misunderstood', 'conflict', 'argument', 'tension', 'unstable']
      },
      endorphin: {
        positive: ['supported', 'helped', 'comfort', 'relief', 'soothing', 'healing', 'recovered', 'better', 'strength', 'encouraged', 'uplifted', 'caring', 'nurturing', 'protective', 'gentle'],
        negative: ['pain', 'hurt', 'suffering', 'struggling', 'difficult', 'challenging', 'overwhelming', 'exhausted']
      }
    };

    // Relationship dynamics indicators
    const dynamicsMarkers = {
      support: ['helped', 'supported', 'encouraged', 'there for', 'stood by', 'assisted', 'guided', 'comforted', 'listened', 'understood'],
      conflict: ['argument', 'fight', 'disagreement', 'conflict', 'tension', 'misunderstanding', 'hurt', 'angry', 'frustrated', 'upset'],
      growth: ['learned', 'grew', 'developed', 'improved', 'changed', 'evolved', 'matured', 'progress', 'better', 'stronger'],
      intimacy: ['shared', 'opened up', 'vulnerable', 'honest', 'deep', 'meaningful', 'personal', 'private', 'secrets', 'feelings'],
      resilience: ['overcome', 'survived', 'recovered', 'bounced back', 'persevered', 'endured', 'weathered', 'through', 'stronger']
    };

    // Analysis function for each narrative
    const analyzeText = (text, phaseWeight = 1) => {
      if (!text || typeof text !== 'string') return { oxytocin: 0, dopamine: 0, serotonin: 0, endorphin: 0, support: 0, conflict: 0, growth: 0, intimacy: 0, resilience: 0, emotional_intensity: 0, narrative_depth: 0 };
      
      const words = text.toLowerCase().split(/\W+/).filter(word => word.length > 0);
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
      const wordCount = words.length;
      
      const scores = {
        oxytocin: 0,
        dopamine: 0,
        serotonin: 0,
        endorphin: 0,
        support: 0,
        conflict: 0,
        growth: 0,
        intimacy: 0,
        resilience: 0,
        emotional_intensity: 0,
        narrative_depth: Math.min(wordCount / 50, 1) // Normalize based on length
      };

      // Count emotional markers
      Object.entries(emotionalMarkers).forEach(([pathway, markers]) => {
        if (markers.positive) {
          markers.positive.forEach(word => {
            const count = words.filter(w => w.includes(word)).length;
            scores[pathway] += count * phaseWeight;
          });
        }
        if (markers.negative) {
          markers.negative.forEach(word => {
            const count = words.filter(w => w.includes(word)).length;
            scores[pathway] -= count * 0.5 * phaseWeight; // Negative impact
          });
        }
      });

      // Count dynamics markers
      Object.entries(dynamicsMarkers).forEach(([dynamic, markers]) => {
        markers.forEach(word => {
          const count = words.filter(w => w.includes(word)).length;
          scores[dynamic] += count * phaseWeight;
        });
      });

      // Calculate emotional intensity based on adjectives and descriptive language
      const intensityWords = ['very', 'extremely', 'incredibly', 'absolutely', 'completely', 'totally', 'deeply', 'profoundly', 'intensely'];
      scores.emotional_intensity = intensityWords.reduce((sum, word) => {
        return sum + words.filter(w => w.includes(word)).length;
      }, 0) * phaseWeight;

      return scores;
    };

    // Analyze each phase
    const earlyAnalysis = analyzeText(earlyBonding, 1.0);
    const challengesAnalysis = analyzeText(challenges, 0.8); // Slightly reduced weight for challenges
    const currentAnalysis = analyzeText(currentState, 1.2); // Higher weight for current state

    // Combine and normalize scores
    const combinedScores = {
      oxytocin: Math.max(0, earlyAnalysis.oxytocin * 0.4 + challengesAnalysis.oxytocin * 0.2 + currentAnalysis.oxytocin * 0.4),
      dopamine: Math.max(0, earlyAnalysis.dopamine * 0.3 + challengesAnalysis.dopamine * 0.2 + currentAnalysis.dopamine * 0.5),
      serotonin: Math.max(0, earlyAnalysis.serotonin * 0.2 + challengesAnalysis.serotonin * 0.5 + currentAnalysis.serotonin * 0.3),
      endorphin: Math.max(0, earlyAnalysis.endorphin * 0.3 + challengesAnalysis.endorphin * 0.4 + currentAnalysis.endorphin * 0.3),
      support: earlyAnalysis.support + challengesAnalysis.support + currentAnalysis.support,
      conflict: challengesAnalysis.conflict * 0.7 + earlyAnalysis.conflict * 0.2 + currentAnalysis.conflict * 0.1,
      growth: challengesAnalysis.growth * 0.6 + currentAnalysis.growth * 0.4,
      intimacy: earlyAnalysis.intimacy * 0.4 + currentAnalysis.intimacy * 0.6,
      resilience: challengesAnalysis.resilience * 0.7 + currentAnalysis.resilience * 0.3,
      emotional_intensity: (earlyAnalysis.emotional_intensity + challengesAnalysis.emotional_intensity + currentAnalysis.emotional_intensity) / 3,
      narrative_depth: (earlyAnalysis.narrative_depth + challengesAnalysis.narrative_depth + currentAnalysis.narrative_depth) / 3
    };

    // Normalize pathway strengths (0-1 scale)
    const maxPathwayScore = Math.max(combinedScores.oxytocin, combinedScores.dopamine, combinedScores.serotonin, combinedScores.endorphin, 1);
    
    const pathwayStrengths = {
      oxytocin: Math.min(1, combinedScores.oxytocin / maxPathwayScore),
      dopamine: Math.min(1, combinedScores.dopamine / maxPathwayScore),
      serotonin: Math.min(1, combinedScores.serotonin / maxPathwayScore),
      endorphin: Math.min(1, combinedScores.endorphin / maxPathwayScore)
    };

    // Calculate network metrics
    const avgPathwayStrength = Object.values(pathwayStrengths).reduce((sum, val) => sum + val, 0) / 4;
    const resilienceFactor = Math.min(1, combinedScores.resilience / 5);
    const supportFactor = Math.min(1, combinedScores.support / 10);
    const growthFactor = Math.min(1, combinedScores.growth / 5);
    const conflictPenalty = Math.min(0.5, combinedScores.conflict / 10);

    const activeNodes = Math.floor(200 * (avgPathwayStrength * 0.6 + combinedScores.narrative_depth * 0.4));
    const connectionDensity = Math.round((avgPathwayStrength * 0.5 + supportFactor * 0.3 + resilienceFactor * 0.2) * 100);
    const networkStrength = Math.round((avgPathwayStrength * 0.4 + growthFactor * 0.3 + supportFactor * 0.3) * (1 - conflictPenalty) * 100);
    const pathwayEfficiency = Math.round((avgPathwayStrength * 0.6 + (1 - conflictPenalty) * 0.4) * 100);

    return {
      activeNodes: Math.max(20, activeNodes),
      connectionDensity: Math.max(10, connectionDensity),
      networkStrength: Math.max(15, networkStrength),
      pathwayEfficiency: Math.max(20, pathwayEfficiency),
      pathwayStrengths,
      overallHealth: Math.round(avgPathwayStrength * 100),
      insights: {
        support: supportFactor,
        conflict: conflictPenalty,
        growth: growthFactor,
        resilience: resilienceFactor,
        intimacy: Math.min(1, combinedScores.intimacy / 8),
        emotional_intensity: Math.min(1, combinedScores.emotional_intensity / 5)
      }
    };
  };

  // Generate network visualization data
  const generateNetworkData = (metrics) => {
    const { activeNodes, pathwayStrengths } = metrics;
    const newNodes = [];
    const newEdges = [];

    // Create nodes for each pathway type
    Object.entries(pathwayTypes).forEach(([pathway, config], pathwayIndex) => {
      const strength = pathwayStrengths[pathway];
      const nodeCount = Math.max(5, Math.floor(activeNodes * 0.25 * (strength + 0.3)));
      
      for (let i = 0; i < nodeCount; i++) {
        const angle = (pathwayIndex * Math.PI * 0.5) + (i / nodeCount) * Math.PI * 0.5 + Math.random() * 0.3;
        const radius = 80 + Math.random() * 120 + strength * 50;
        
        newNodes.push({
          id: `${pathway}_${i}`,
          x: 300 + Math.cos(angle) * radius,
          y: 200 + Math.sin(angle) * radius,
          pathway,
          color: config.color,
          size: 3 + strength * 6 + Math.random() * 2,
          strength,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5
        });
      }
    });

    // Create edges between nodes with higher probability for same pathway
    newNodes.forEach((node, i) => {
      newNodes.forEach((otherNode, j) => {
        if (i < j) {
          const distance = Math.sqrt(
            Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
          );
          
          const samePathway = node.pathway === otherNode.pathway;
          const connectionProb = samePathway ? 
            metrics.connectionDensity / 100 * 0.6 : 
            metrics.connectionDensity / 100 * 0.2;
          
          if (distance < 180 && Math.random() < connectionProb) {
            newEdges.push({
              from: node.id,
              to: otherNode.id,
              strength: (node.strength + otherNode.strength) / 2,
              opacity: Math.min(0.8, (node.strength + otherNode.strength) / 2),
              samePathway
            });
          }
        }
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  };

  // Canvas drawing function with animation
  const drawNetwork = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 600, 400);
    
    // Draw edges
    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      
      if (fromNode && toNode) {
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = edge.samePathway ? 
          `rgba(255, 255, 255, ${edge.opacity * 0.5})` : 
          `rgba(255, 255, 255, ${edge.opacity * 0.2})`;
        ctx.lineWidth = Math.max(0.5, edge.strength * 1.5);
        ctx.stroke();
      }
    });
    
    // Draw nodes with enhanced effects
    nodes.forEach(node => {
      // Main node
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.globalAlpha = 0.9;
      ctx.fill();
      
      // Glow effect for stronger nodes
      if (node.strength > 0.6) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size + 4, 0, 2 * Math.PI);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = 0.3;
        ctx.fill();
        
        if (node.strength > 0.8) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size + 8, 0, 2 * Math.PI);
          ctx.fillStyle = node.color;
          ctx.globalAlpha = 0.1;
          ctx.fill();
        }
      }
      
      ctx.globalAlpha = 1;
    });
  };

  // Animation loop for subtle node movement
  useEffect(() => {
    if (nodes.length === 0) return;
    
    const animationId = setInterval(() => {
      setNodes(prevNodes => 
        prevNodes.map(node => ({
          ...node,
          x: node.x + node.vx,
          y: node.y + node.vy,
          vx: node.vx * 0.99 + (Math.random() - 0.5) * 0.1,
          vy: node.vy * 0.99 + (Math.random() - 0.5) * 0.1
        }))
      );
    }, 100);
    
    return () => clearInterval(animationId);
  }, [nodes.length]);

  // Draw network when nodes/edges update
  useEffect(() => {
    if (nodes.length > 0) {
      drawNetwork();
    }
  }, [nodes, edges]);

  const handleNarrativeChange = (phase, value) => {
    setNarratives(prev => ({
      ...prev,
      [phase]: value
    }));
  };

  const handleAnalyze = async () => {
    if (!narratives.earlyBonding.trim() || !narratives.challenges.trim() || !narratives.currentState.trim()) {
      alert('Please complete all three phases of your story before analyzing.');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const analysisResult = analyzeNarrative(narratives);
      console.log('Analysis result:', analysisResult); // Debug log
      
      setAnalysis(analysisResult);
      generateNetworkData(analysisResult);
      setShowResults(true);
      setIsAnalyzing(false);
    } catch (error) {
      console.error('Analysis error:', error);
      setIsAnalyzing(false);
      alert('There was an error analyzing your story. Please try again.');
    }
  };

  const nextPhase = () => {
    if (currentPhase < phases.length - 1) {
      setCurrentPhase(currentPhase + 1);
    }
  };

  const prevPhase = () => {
    if (currentPhase > 0) {
      setCurrentPhase(currentPhase - 1);
    }
  };

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const generateInsights = (analysis) => {
    const insights = [];
    const { pathwayStrengths, insights: rawInsights } = analysis;

    if (pathwayStrengths.oxytocin > 0.8) {
      insights.push("🤝 Strong foundation of trust and bonding - your relationship has deep roots");
    } else if (pathwayStrengths.oxytocin < 0.4) {
      insights.push("💙 Consider activities that build trust and emotional safety together");
    }

    if (pathwayStrengths.dopamine > 0.7) {
      insights.push("✨ High joy and reward patterns - you bring happiness to each other");
    } else if (pathwayStrengths.dopamine < 0.4) {
      insights.push("🎯 Create more shared positive experiences and adventures together");
    }

    if (rawInsights.resilience > 0.7) {
      insights.push("💪 Excellent resilience - you've proven you can weather challenges together");
    }

    if (rawInsights.growth > 0.6) {
      insights.push("🌱 Strong growth patterns - this relationship helps you both evolve");
    }

    if (rawInsights.conflict > 0.4) {
      insights.push("🔄 Work on conflict resolution strategies to strengthen your bond");
    }

    return insights;
  };

  if (showResults && analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Brain className="w-8 h-8 text-blue-400" />
              <Heart className="w-8 h-8 text-red-400" />
              <Sparkles className="w-8 h-8 text-yellow-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Your Relationship Analysis
            </h1>
            <p className="text-gray-300">Neural network insights from your story</p>
          </div>

          {/* Network Visualization */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Neural Network Visualization
            </h2>
            
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="w-full h-auto bg-gray-900/50 rounded-lg border border-gray-600"
              />
              
              {/* Pathway Legend */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                {Object.entries(pathwayTypes).map(([pathway, config]) => (
                  <div key={pathway} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: config.color }}
                    />
                    <span className="text-xs">{config.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Network Analysis Results</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{analysis.connectionDensity}%</div>
                <div className="text-sm text-gray-400">Connection Density</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{analysis.networkStrength}%</div>
                <div className="text-sm text-gray-400">Network Strength</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{analysis.activeNodes}</div>
                <div className="text-sm text-gray-400">Active Nodes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{analysis.pathwayEfficiency}%</div>
                <div className="text-sm text-gray-400">Pathway Efficiency</div>
              </div>
            </div>

            {/* Overall Health Score */}
            <div className="text-center mb-8">
              <div className={`text-5xl font-bold ${getHealthColor(analysis.overallHealth)}`}>
                {analysis.overallHealth}%
              </div>
              <div className="text-lg text-gray-400">Overall Relationship Health</div>
            </div>

            {/* Pathway Breakdown */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Neurochemical Pathway Strengths</h3>
                <div className="space-y-3">
                  {Object.entries(analysis.pathwayStrengths).map(([pathway, strength]) => (
                    <div key={pathway} className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: pathwayTypes[pathway].color }}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="capitalize">{pathway}</span>
                          <span className="font-semibold">{Math.round(strength * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                          <div 
                            className="h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${strength * 100}%`,
                              backgroundColor: pathwayTypes[pathway].color
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">AI-Generated Insights</h3>
                <div className="space-y-2">
                  {generateInsights(analysis).map((insight, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"/>
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                setShowResults(false);
                setCurrentPhase(0);
                setNarratives({ earlyBonding: '', challenges: '', currentState: '' });
                setAnalysis(null);
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              Analyze Another Relationship
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-blue-400" />
            <Heart className="w-8 h-8 text-red-400" />
            <Brain className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Relationship Neural Network Analyzer
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Tell the story of your relationship, and we'll analyze it through the lens of neuroscience 
            to reveal the neural patterns that define your connection.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {phases.map((phase, index) => (
              <React.Fragment key={phase.id}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                  index === currentPhase 
                    ? 'bg-blue-500 text-white' 
                    : index < currentPhase 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-600 text-gray-400'
                }`}>
                  {index + 1}
                </div>
                {index < phases.length - 1 && (
                  <div className={`w-12 h-1 rounded-full transition-all duration-200 ${
                    index < currentPhase ? 'bg-green-500' : 'bg-gray-600'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Current Phase */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <div className="text-center mb-8">
              <div className={`inline-block px-6 py-3 rounded-full bg-gradient-to-r ${phases[currentPhase].color} text-white font-semibold mb-4`}>
                Phase {currentPhase + 1} of {phases.length}
              </div>
              <h2 className="text-3xl font-bold mb-2">{phases[currentPhase].title}</h2>
              <p className="text-gray-400 text-lg">{phases[currentPhase].subtitle}</p>
            </div>

            {/* Prompts */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-300">Consider these questions as you write:</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {phases[currentPhase].prompts.map((prompt, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                    <span>{prompt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Narrative Input */}
            <div className="mb-8">
              <textarea
                value={narratives[phases[currentPhase].id]}
                onChange={(e) => handleNarrativeChange(phases[currentPhase].id, e.target.value)}
                placeholder={phases[currentPhase].placeholder}
                className="w-full h-64 bg-gray-700/50 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={2000}
              />
              <div className="text-right text-sm text-gray-400 mt-2">
                {narratives[phases[currentPhase].id].length}/2000 characters
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={prevPhase}
                disabled={currentPhase === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  currentPhase === 0
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-600 hover:bg-gray-500 text-white'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              {currentPhase === phases.length - 1 ? (
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !narratives.earlyBonding.trim() || !narratives.challenges.trim() || !narratives.currentState.trim()}
                  className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    isAnalyzing || !narratives.earlyBonding.trim() || !narratives.challenges.trim() || !narratives.currentState.trim()
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Analyzing Your Story...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Analyze Relationship
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={nextPhase}
                  disabled={!narratives[phases[currentPhase].id].trim()}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    !narratives[phases[currentPhase].id].trim()
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                  }`}
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Phase Summary */}
          {Object.values(narratives).some(n => n.trim()) && (
            <div className="mt-8 bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Your Story Progress
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {phases.map((phase, index) => (
                  <div key={phase.id} className={`p-4 rounded-lg border ${
                    narratives[phase.id].trim() 
                      ? 'border-green-500 bg-green-500/10' 
                      : 'border-gray-600 bg-gray-700/30'
                  }`}>
                    <div className="font-semibold text-sm">{phase.title}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {narratives[phase.id].trim() 
                        ? `${narratives[phase.id].length} characters written` 
                        : 'Not started'
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NarrativeRelationshipAnalyzer;