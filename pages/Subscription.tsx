import React from 'react';
import { User, SubscriptionTier } from '../types';
import { Check, X, Shield, Zap, Crown } from 'lucide-react';

interface SubscriptionProps {
  user: User;
  onUpgrade: (tier: SubscriptionTier) => void;
}

export const Subscription: React.FC<SubscriptionProps> = ({ user, onUpgrade }) => {
  const plans = [
    {
      id: SubscriptionTier.FREE,
      name: 'Analyst Basic',
      price: '$0',
      period: '/mo',
      description: 'Essential tools for individual researchers',
      features: [
        '50 Scans per day',
        'Basic URL & File Analysis',
        'Standard Processing Speed',
        '30-Day History Retention',
        'Community Support'
      ],
      notIncluded: ['Threat Removal', 'API Access', 'Priority Support', 'Team Collaboration'],
      color: 'slate'
    },
    {
      id: SubscriptionTier.PRO,
      name: 'Hunter Pro',
      price: '$29',
      period: '/mo',
      description: 'Advanced capabilities for professional threat hunters',
      features: [
        'Unlimited Scans',
        'Advanced Static Analysis',
        'Automated Threat Removal',
        'Priority Processing Queue',
        '1-Year History Retention',
        'Email Support'
      ],
      notIncluded: ['API Access', 'Team Collaboration', 'SSO'],
      color: 'emerald',
      popular: true
    },
    {
      id: SubscriptionTier.ENTERPRISE,
      name: 'Enterprise',
      price: '$99',
      period: '/mo',
      description: 'Complete platform for SOC teams and organizations',
      features: [
        'Everything in Pro',
        'Full API Access',
        'Team Management & SSO',
        'Custom Retention Policies',
        'Dedicated Account Manager',
        '24/7 SLA Support'
      ],
      notIncluded: [],
      color: 'purple'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Choose Your Weapon</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Upgrade your threat hunting capabilities with advanced analysis, automated remediation, and enterprise-grade support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const isCurrent = user.subscriptionTier === plan.id;
          const isPro = plan.id === SubscriptionTier.PRO;
          const isEnt = plan.id === SubscriptionTier.ENTERPRISE;
          
          let borderColor = 'border-slate-700';
          let bgColor = 'bg-slate-800';
          let btnColor = 'bg-slate-700 hover:bg-slate-600 text-white';

          if (isPro) {
            borderColor = 'border-emerald-500';
            bgColor = 'bg-slate-800/80 shadow-2xl shadow-emerald-900/20';
            btnColor = 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40';
          } else if (isEnt) {
             borderColor = 'border-purple-500/50';
             btnColor = 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/40';
          }

          return (
            <div key={plan.id} className={`relative flex flex-col p-8 rounded-2xl border ${borderColor} ${bgColor} transition-transform hover:-translate-y-1`}>
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-lg font-bold ${isPro ? 'text-emerald-400' : isEnt ? 'text-purple-400' : 'text-slate-300'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-end gap-1 mt-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-500 mb-1">{plan.period}</span>
                </div>
                <p className="text-sm text-slate-400 mt-4">{plan.description}</p>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 flex-shrink-0 ${isPro ? 'text-emerald-500' : isEnt ? 'text-purple-500' : 'text-slate-500'}`} />
                    <span className="text-sm text-slate-300">{feature}</span>
                  </div>
                ))}
                {plan.notIncluded.map((feature, idx) => (
                   <div key={`ni-${idx}`} className="flex items-start gap-3 opacity-50">
                    <X className="w-5 h-5 flex-shrink-0 text-slate-600" />
                    <span className="text-sm text-slate-500">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onUpgrade(plan.id)}
                disabled={isCurrent}
                className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${btnColor} ${isCurrent ? 'opacity-50 cursor-default' : ''}`}
              >
                {isCurrent ? (
                  <>Current Plan</>
                ) : (
                  <>
                     {isPro && <Zap className="w-4 h-4" />}
                     {isEnt && <Crown className="w-4 h-4" />}
                     Upgrade to {plan.name}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};