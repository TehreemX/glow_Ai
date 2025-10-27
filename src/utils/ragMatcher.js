// RAG (Retrieval-Augmented Generation) Matcher
export const findBestMatch = (userProfile, dataset) => {
  let scores = dataset.map(() => 0);

  // Age matching with scoring
  if (userProfile.age) {
    const userAge = parseInt(userProfile.age);
    dataset.forEach((item, index) => {
      const [min, max] = item.age_range.split('-').map(n => parseInt(n));
      if (userAge >= min && userAge <= max) {
        scores[index] += 3;
      } else if (Math.abs(userAge - min) <= 5 || Math.abs(userAge - max) <= 5) {
        scores[index] += 1;
      }
    });
  }

  // Gender matching
  if (userProfile.gender) {
    dataset.forEach((item, index) => {
      if (item.gender.toLowerCase() === userProfile.gender.toLowerCase()) {
        scores[index] += 2;
      }
    });
  }

  // Skin type matching
  if (userProfile.skinType) {
    dataset.forEach((item, index) => {
      if (item.skin_type.toLowerCase() === userProfile.skinType.toLowerCase()) {
        scores[index] += 2;
      }
    });
  }

  // Concern matching (highest priority)
  if (userProfile.concern) {
    dataset.forEach((item, index) => {
      const concern = userProfile.concern.toLowerCase().replace(/\s/g, '');
      if (item.main_concern.toLowerCase().includes(concern)) {
        scores[index] += 5;
      }
    });
  }

  // Find best match
  let bestIndex = 0;
  let bestScore = scores[0];
  
  for (let i = 1; i < scores.length; i++) {
    if (scores[i] > bestScore) {
      bestScore = scores[i];
      bestIndex = i;
    }
  }

  if (bestScore >= 5) {
    return dataset[bestIndex];
  }

  return null;
};

// Generic advice generator
export const generateGenericAdvice = (profile) => {
  let advice = "Based on your profile, here are general recommendations:\n\n";

  if (profile.skinType === 'oily') {
    advice += "• Use oil-free, non-comedogenic products\n• Cleanse twice daily\n• Lightweight gel moisturizer\n";
  } else if (profile.skinType === 'dry') {
    advice += "• Use cream-based cleansers\n• Hydrating serums\n• Rich moisturizers\n";
  } else if (profile.skinType === 'combination') {
    advice += "• Balanced cleanser\n• Light moisturizer on T-zone\n• Richer cream on dry areas\n";
  } else if (profile.skinType === 'sensitive') {
    advice += "• Fragrance-free products\n• Avoid harsh exfoliants\n• Soothing ingredients\n";
  }

  advice += "\nGeneral tips:\n• SPF 30+ daily\n• Stay hydrated\n• 7-8 hours sleep\n• Healthy diet";

  return advice;
};