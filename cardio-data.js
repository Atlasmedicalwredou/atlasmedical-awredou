
/* =====================================================
   ATLAS MÉDICAL BY @WREDOU
   ATLAS CARDIOVASCULAIRE
   Bibliothèque pédagogique structurée
   Version 1.1.0
===================================================== */

window.ATLAS_CARDIO_DATA = {
  id: "cardiologie",
  title: "Atlas cardiovasculaire",
  version: "1.1.0",
  language: "fr",

  modules: [

    {
      id: "anatomie",
      title: "Anatomie cardiovasculaire",
      description: "Comprendre la structure du cœur et des vaisseaux.",
      icon: "❤️",
      chapters: [
        {
          id: "coeur",
          title: "Anatomie générale du cœur",
          sections: [
            {
              heading: "Présentation générale",
              content: "Le cœur est un organe musculaire creux situé dans le médiastin moyen. Il assure la circulation du sang dans les circulations pulmonaire et systémique."
            },
            {
              heading: "Situation anatomique",
              content: "Il est situé dans le thorax, entre les deux poumons, en arrière du sternum et au-dessus du diaphragme. Son axe est oblique, avec une orientation générale vers la gauche."
            },
            {
              heading: "Les quatre cavités",
              content: "Le cœur comprend deux oreillettes et deux ventricules. L'oreillette droite reçoit le sang veineux systémique. Le ventricule droit l'envoie vers les poumons. L'oreillette gauche reçoit le sang oxygéné provenant des poumons. Le ventricule gauche l'éjecte dans l'aorte."
            },
            {
              heading: "Les valves cardiaques",
              content: "La valve tricuspide sépare l'oreillette droite du ventricule droit. La valve pulmonaire se situe entre le ventricule droit et le tronc pulmonaire. La valve mitrale sépare l'oreillette gauche du ventricule gauche. La valve aortique se situe entre le ventricule gauche et l'aorte."
            },
            {
              heading: "Les enveloppes du cœur",
              content: "Le cœur est entouré par le péricarde. Sa paroi comprend trois couches : l'endocarde, le myocarde et l'épicarde."
            },
            {
              heading: "À retenir",
              content: "Le cœur droit assure la circulation pulmonaire. Le cœur gauche assure la circulation systémique. Les valves orientent le flux sanguin et empêchent normalement son reflux."
            }
          ]
        },
        {
          id: "circulation",
          title: "Circulation sanguine",
          sections: [
            {
              heading: "Petite circulation",
              content: "Le sang pauvre en oxygène quitte le ventricule droit par le tronc pulmonaire, rejoint les artères pulmonaires, traverse les capillaires pulmonaires puis revient oxygéné à l'oreillette gauche par les veines pulmonaires."
            },
            {
              heading: "Grande circulation",
              content: "Le sang oxygéné quitte le ventricule gauche par l'aorte, irrigue les organes et revient au cœur droit par les veines caves."
            },
            {
              heading: "Trajet complet du sang",
              content: "Veines caves → oreillette droite → valve tricuspide → ventricule droit → valve pulmonaire → artères pulmonaires → poumons → veines pulmonaires → oreillette gauche → valve mitrale → ventricule gauche → valve aortique → aorte."
            }
          ]
        },
        {
          id: "vascularisation",
          title: "Vascularisation du cœur",
          sections: [
            {
              heading: "Artères coronaires",
              content: "Le myocarde est principalement vascularisé par les artères coronaires droite et gauche, qui naissent de la racine aortique."
            },
            {
              heading: "Coronaire gauche",
              content: "Elle donne principalement l'artère interventriculaire antérieure et l'artère circonflexe. Leurs territoires dépendent de l'anatomie coronaire individuelle."
            },
            {
              heading: "Coronaire droite",
              content: "Elle vascularise habituellement une partie du cœur droit et, selon la dominance coronaire, une partie du territoire inférieur et postérieur."
            },
            {
              heading: "Intérêt clinique",
              content: "L'occlusion d'une artère coronaire peut provoquer une ischémie myocardique et un infarctus du myocarde."
            }
          ]
        }
      ]
    },

    {
      id: "syndromes",
      title: "Syndromes et triades",
      description: "Reconnaître les grands tableaux cliniques.",
      icon: "🩺",
      chapters: [
        {
          id: "insuffisance-cardiaque",
          title: "Syndrome d'insuffisance cardiaque",
          sections: [
            {
              heading: "Définition",
              content: "L'insuffisance cardiaque est un syndrome clinique dans lequel une anomalie structurelle ou fonctionnelle du cœur entraîne une élévation des pressions intracardiaques, un débit insuffisant ou les deux."
            },
            {
              heading: "Signes fonctionnels",
              content: "Dyspnée d'effort, orthopnée, dyspnée paroxystique nocturne, fatigue et diminution de la tolérance à l'effort peuvent être observées."
            },
            {
              heading: "Signes physiques",
              content: "Selon le contexte : crépitants pulmonaires, turgescence jugulaire, reflux hépato-jugulaire, œdèmes déclives et parfois troisième bruit cardiaque."
            },
            {
              heading: "Orientation clinique",
              content: "L'évaluation repose sur l'interrogatoire, l'examen clinique, l'ECG, les peptides natriurétiques et l'échocardiographie selon le contexte."
            }
          ]
        },
        {
          id: "syndrome-coronarien",
          title: "Syndrome coronarien aigu",
          sections: [
            {
              heading: "Présentation",
              content: "Le syndrome coronarien aigu correspond à une diminution brutale du flux sanguin coronaire, généralement liée à une complication de plaque athéroscléreuse."
            },
            {
              heading: "Signes évocateurs",
              content: "Douleur ou oppression thoracique, souvent rétrosternale, pouvant irradier vers les bras, les épaules, la mâchoire ou le dos. Des présentations atypiques sont possibles."
            },
            {
              heading: "Examens essentiels",
              content: "L'ECG doit être réalisé rapidement et interprété dans le contexte clinique. Le dosage de troponine ultrasensible est effectué selon les protocoles recommandés."
            },
            {
              heading: "Point de vigilance",
              content: "Une suspicion de syndrome coronarien aigu nécessite une évaluation médicale urgente. Un ECG initial non diagnostique n'exclut pas le diagnostic."
            }
          ]
        },
        {
          id: "syndrome-oedemateux",
          title: "Syndrome œdémateux d'origine cardiaque",
          sections: [
            {
              heading: "Définition",
              content: "L'œdème correspond à une accumulation excessive de liquide dans le compartiment interstitiel."
            },
            {
              heading: "Présentation clinique",
              content: "Les œdèmes d'origine cardiaque sont souvent bilatéraux, déclives et prenant le godet. Ils peuvent être associés à une prise de poids et à d'autres signes de congestion."
            },
            {
              heading: "Interprétation",
              content: "Un œdème des membres inférieurs n'est pas spécifique de l'insuffisance cardiaque. Il faut rechercher les causes veineuses, rénales, hépatiques et médicamenteuses."
            }
          ]
        }
      ]
    },

    {
      id: "semiologie",
      title: "Sémiologie cardiovasculaire",
      description: "Maîtriser l'interrogatoire et l'examen clinique.",
      icon: "🔎",
      chapters: [
        {
          id: "douleur-thoracique",
          title: "La douleur thoracique",
          sections: [
            {
              heading: "Interrogatoire",
              content: "Préciser le siège, le début, la durée, le type, l'intensité, les irradiations, les facteurs déclenchants, les facteurs calmants et les signes associés."
            },
            {
              heading: "Caractéristiques évocatrices",
              content: "Une douleur constrictive rétrosternale déclenchée par l'effort peut évoquer une origine coronarienne. Une douleur brutale transfixiante peut faire évoquer une dissection aortique. Une douleur augmentée par l'inspiration peut orienter vers une cause pleurale ou péricardique."
            },
            {
              heading: "Signes de gravité",
              content: "Instabilité hémodynamique, syncope, dyspnée aiguë, sueurs, pâleur, confusion et douleur persistante imposent une évaluation urgente."
            }
          ]
        },
        {
          id: "dyspnee",
          title: "La dyspnée",
          sections: [
            {
              heading: "Définition",
              content: "La dyspnée est une sensation subjective de gêne respiratoire ou de difficulté à respirer."
            },
            {
              heading: "Interrogatoire",
              content: "Préciser le caractère aigu ou chronique, le lien avec l'effort, la position, la présence d'une orthopnée ou d'épisodes nocturnes."
            },
            {
              heading: "Examen clinique",
              content: "Évaluer la fréquence respiratoire, la saturation en oxygène, les signes de lutte, l'auscultation pulmonaire et les signes de congestion."
            }
          ]
        },
        {
          id: "examen-cardiaque",
          title: "Examen cardiovasculaire",
          sections: [
            {
              heading: "Inspection",
              content: "Observer l'état général, la coloration cutanée, la fréquence respiratoire, les jugulaires, les œdèmes et les éventuels signes de mauvaise perfusion."
            },
            {
              heading: "Palpation",
              content: "Évaluer les pouls périphériques, leur symétrie, leur amplitude, le choc de pointe et rechercher un reflux hépato-jugulaire si indiqué."
            },
            {
              heading: "Auscultation",
              content: "Écouter les foyers aortique, pulmonaire, tricuspide et mitral. Identifier les bruits B1 et B2, les souffles et les bruits surajoutés."
            },
            {
              heading: "Mesures",
              content: "Mesurer la pression artérielle, la fréquence cardiaque et, si nécessaire, la saturation en oxygène et la température."
            }
          ]
        }
      ]
    },

    {
      id: "bilans",
      title: "Bilans cardiovasculaires",
      description: "Comprendre les examens complémentaires.",
      icon: "🧪",
      chapters: [
        {
          id: "biologie",
          title: "Bilan biologique cardiovasculaire",
          sections: [
            {
              heading: "Troponines",
              content: "Les troponines cardiaques sont des biomarqueurs de lésion myocardique. Leur élévation doit être interprétée selon la cinétique, le contexte clinique et l'ECG."
            },
            {
              heading: "BNP et NT-proBNP",
              content: "Ces peptides natriurétiques contribuent à l'évaluation d'une suspicion d'insuffisance cardiaque. Leur interprétation dépend notamment de l'âge, de la fonction rénale, de l'obésité et du contexte clinique."
            },
            {
              heading: "Autres examens",
              content: "Selon la situation : numération formule sanguine, ionogramme, créatinine, glycémie, bilan lipidique et bilan thyroïdien."
            }
          ]
        },
        {
          id: "echocardiographie",
          title: "Échocardiographie",
          sections: [
            {
              heading: "Principe",
              content: "L'échocardiographie utilise les ultrasons pour étudier la structure et le fonctionnement du cœur."
            },
            {
              heading: "Éléments évalués",
              content: "Dimensions des cavités, fonction systolique et diastolique, valves, péricarde, pressions estimées et anomalies segmentaires selon l'examen."
            },
            {
              heading: "Intérêt clinique",
              content: "Elle occupe une place centrale dans l'évaluation de nombreuses cardiopathies."
            }
          ]
        },
        {
          id: "radiographie-thorax",
          title: "Radiographie thoracique",
          sections: [
            {
              heading: "Objectifs",
              content: "Elle permet d'examiner la silhouette cardiaque, les champs pulmonaires, la vascularisation pulmonaire et certains signes de congestion."
            },
            {
              heading: "Limites",
              content: "Elle ne permet pas à elle seule de confirmer ou d'exclure une insuffisance cardiaque."
            }
          ]
        }
      ]
    },

    {
      id: "ecg",
      title: "Interprétation ECG",
      description: "Apprendre à lire un électrocardiogramme.",
      icon: "📈",
      chapters: [
        {
          id: "bases-ecg",
          title: "Bases de l'électrocardiogramme",
          sections: [
            {
              heading: "Définition",
              content: "L'électrocardiogramme enregistre l'activité électrique du cœur à la surface du corps."
            },
            {
              heading: "Calibration habituelle",
              content: "La vitesse habituelle est de 25 mm/s et l'étalonnage habituel de 10 mm/mV. Il faut toujours vérifier les paramètres affichés sur le tracé."
            },
            {
              heading: "Ondes principales",
              content: "L'onde P correspond à la dépolarisation atriale. Le complexe QRS correspond à la dépolarisation ventriculaire. L'onde T correspond à la repolarisation ventriculaire."
            }
          ]
        },
        {
          id: "methode-ecg",
          title: "Méthode systématique de lecture",
          sections: [
            {
              heading: "Étape 1 : fréquence",
              content: "Déterminer si le rythme est lent, normal ou rapide et mesurer la fréquence cardiaque."
            },
            {
              heading: "Étape 2 : rythme",
              content: "Rechercher la régularité, la présence des ondes P et leur relation avec les complexes QRS."
            },
            {
              heading: "Étape 3 : axe",
              content: "Évaluer l'axe électrique frontal à partir des dérivations des membres."
            },
            {
              heading: "Étape 4 : intervalles",
              content: "Mesurer PR, QRS et QT, en tenant compte de la correction de QT selon la fréquence cardiaque."
            },
            {
              heading: "Étape 5 : morphologie",
              content: "Examiner les ondes P, les QRS, le segment ST et les ondes T dans les différentes dérivations."
            }
          ]
        }
      ]
    },

    {
      id: "urgences",
      title: "Urgences cardiovasculaires",
      description: "Identifier les situations potentiellement vitales.",
      icon: "🚨",
      chapters: [
        {
          id: "arret-cardiaque",
          title: "Arrêt cardiaque",
          sections: [
            {
              heading: "Reconnaissance",
              content: "Une personne inconsciente qui ne respire pas normalement doit faire suspecter un arrêt cardiaque."
            },
            {
              heading: "Conduite immédiate",
              content: "Alerter immédiatement les secours, demander un défibrillateur automatisé externe et commencer la réanimation cardiopulmonaire selon sa formation et les instructions du défibrillateur."
            },
            {
              heading: "Priorité",
              content: "Ne pas retarder l'alerte, les compressions thoraciques ou l'utilisation du défibrillateur."
            }
          ]
        },
        {
          id: "oap",
          title: "Œdème aigu pulmonaire",
          sections: [
            {
              heading: "Présentation",
              content: "L'œdème aigu pulmonaire cardiogénique est une urgence liée à une élévation des pressions de remplissage du cœur gauche avec accumulation de liquide dans les poumons."
            },
            {
              heading: "Signes évocateurs",
              content: "Dyspnée intense, orthopnée, polypnée, crépitants pulmonaires et parfois expectoration mousseuse."
            },
            {
              heading: "Conduite générale",
              content: "Évaluation urgente, surveillance des fonctions vitales et prise en charge médicalisée adaptée à la gravité et à la cause."
            }
          ]
        },
        {
          id: "choc-cardiogenique",
          title: "Choc cardiogénique",
          sections: [
            {
              heading: "Définition",
              content: "Le choc cardiogénique est une défaillance circulatoire aiguë due à une incapacité du cœur à assurer un débit sanguin suffisant."
            },
            {
              heading: "Signes possibles",
              content: "Hypotension, extrémités froides, marbrures, altération de la conscience, oligurie et signes de congestion possibles."
            },
            {
              heading: "Urgence",
              content: "Il nécessite une prise en charge spécialisée immédiate."
            }
          ]
        }
      ]
    },

    {
      id: "classifications",
      title: "Classifications et mémos",
      description: "Retenir les scores et classifications utiles.",
      icon: "📚",
      chapters: [
        {
          id: "nyha",
          title: "Classification NYHA",
          sections: [
            {
              heading: "Classe I",
              content: "Absence de limitation de l'activité physique habituelle."
            },
            {
              heading: "Classe II",
              content: "Limitation légère de l'activité physique. Le patient est confortable au repos."
            },
            {
              heading: "Classe III",
              content: "Limitation marquée de l'activité physique. Le patient est confortable au repos."
            },
            {
              heading: "Classe IV",
              content: "Incapacité d'effectuer une activité physique sans symptômes, avec symptômes possibles au repos."
            }
          ]
        },
        {
          id: "killip",
          title: "Classification de Killip",
          sections: [
            {
              heading: "Classe I",
              content: "Absence de signes cliniques d'insuffisance cardiaque."
            },
            {
              heading: "Classe II",
              content: "Signes d'insuffisance cardiaque modérée, notamment râles crépitants limités, B3 ou turgescence jugulaire."
            },
            {
              heading: "Classe III",
              content: "Œdème aigu pulmonaire."
            },
            {
              heading: "Classe IV",
              content: "Choc cardiogénique."
            }
          ]
        }
      ]
    },

    {
      id: "entrainement",
      title: "QCM et cas cliniques",
      description: "Tester les connaissances et le raisonnement clinique.",
      icon: "🧠",
      chapters: [
        {
          id: "qcm-anatomie",
          title: "QCM d'anatomie cardiovasculaire",
          sections: [
            {
              heading: "Question 1",
              content: "Quelle cavité cardiaque éjecte le sang dans l'aorte ?"
            },
            {
              heading: "Réponse",
              content: "Le ventricule gauche."
            },
            {
              heading: "Explication",
              content: "Le ventricule gauche propulse le sang oxygéné dans la circulation systémique par l'intermédiaire de la valve aortique et de l'aorte."
            }
          ]
        },
        {
          id: "cas-dyspnee",
          title: "Cas clinique : dyspnée",
          sections: [
            {
              heading: "Présentation",
              content: "Un patient consulte pour une dyspnée progressivement croissante à l'effort, associée à des œdèmes bilatéraux des membres inférieurs."
            },
            {
              heading: "Questions de raisonnement",
              content: "Quels éléments de l'interrogatoire faut-il rechercher ? Quels signes physiques faut-il examiner ? Quels examens complémentaires peuvent orienter le diagnostic ?"
            },
            {
              heading: "Orientation pédagogique",
              content: "Le tableau peut évoquer une insuffisance cardiaque, mais d'autres diagnostics doivent être envisagés. Le diagnostic nécessite une évaluation clinique et des examens adaptés."
            }
          ]
        }
      ]
    }

  ]
};

