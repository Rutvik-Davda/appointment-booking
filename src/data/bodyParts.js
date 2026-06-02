export const bodyParts = {
  male: [
    'Head','Hair','Forehead','Eye','Ear','Nose','Mouth','Throat','Neck',
    'Shoulder','Chest','Heart','Lung','Back','Spine','Arm','Elbow','Wrist',
    'Hand','Fingers','Abdomen','Kidney','Liver','Hip','Leg','Knee','Ankle',
    'Foot','Toes','Skin','Teeth','Brain','Muscle','Bone','Thigh','Calf',
  ],
  female: [
    'Hair','Forehead','Eyes','Eyebrows','Eyelashes','Face','Nose','Ears',
    'Mouth','Jaw','Throat','Neck','Shoulder','Chest','Heart','Breast','Back',
    'Spine','Arm','Wrist','Palm','Fingers','Abdomen','Pelvis','Hips','Uterus',
    'Ovaries','Kidney','Legs','Knees','Ankles','Feet','Toes','Skin','Teeth','Brain',
  ],
}

export const specialistMap = {
  Eye:'Eye Specialist',    Eyes:'Eye Specialist',     Eyebrows:'Eye Specialist', Eyelashes:'Eye Specialist',
  Ear:'ENT Specialist',    Ears:'ENT Specialist',     Nose:'ENT Specialist',     Mouth:'ENT Specialist',
  Throat:'ENT Specialist', Jaw:'ENT Specialist',
  Skin:'Dermatologist',    Hair:'Dermatologist',      Face:'Dermatologist',      Forehead:'Dermatologist',
  Bone:'Orthopedic',       Knee:'Orthopedic',         Knees:'Orthopedic',        Spine:'Orthopedic',
  Back:'Orthopedic',       Shoulder:'Orthopedic',     Elbow:'Orthopedic',        Wrist:'Orthopedic',
  Hip:'Orthopedic',        Hips:'Orthopedic',         Leg:'Orthopedic',          Legs:'Orthopedic',
  Foot:'Orthopedic',       Feet:'Orthopedic',         Ankles:'Orthopedic',       Toes:'Orthopedic',
  Thigh:'Orthopedic',      Calf:'Orthopedic',         Arm:'Orthopedic',          Hand:'Orthopedic',
  Palm:'Orthopedic',       Fingers:'Orthopedic',      Ankle:'Orthopedic',        Muscle:'Orthopedic',
  Teeth:'Dentist',
  Heart:'Cardiologist',    Chest:'Cardiologist',      Lung:'Pulmonologist',
  Brain:'Neurologist',     Head:'Neurologist',
  Abdomen:'Gastroenterologist', Pelvis:'Gastroenterologist', Liver:'Gastroenterologist', Kidney:'Nephrologist',
  Breast:'Gynecologist',   Uterus:'Gynecologist',     Ovaries:'Gynecologist',
  Neck:'General Physician',
}

export const getSpecialist = (part) => specialistMap[part] || 'General Physician'
