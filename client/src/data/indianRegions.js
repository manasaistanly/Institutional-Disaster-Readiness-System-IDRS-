// Indian States and Districts - Focus on Telangana
export const indianStates = [
    'Andhra Pradesh',
    'Telangana',
    'Karnataka',
    'Tamil Nadu',
    'Maharashtra',
    'Kerala',
    'Gujarat',
    'Rajasthan',
    'Uttar Pradesh',
    'Madhya Pradesh',
    'West Bengal',
    'Bihar',
    'Odisha',
    'Punjab',
    'Haryana',
    'Delhi',
    'Jharkhand',
    'Chhattisgarh',
    'Uttarakhand',
    'Himachal Pradesh',
    'Assam',
    'Goa',
    'Jammu and Kashmir',
    'Ladakh',
    'Other'
];

// Districts by state - Comprehensive for Telangana
export const districtsByState = {
    'Telangana': [
        'Hyderabad',
        'Ranga Reddy',
        'Medchal-Malkajgiri',
        'Sangareddy',
        'Warangal Urban',
        'Warangal Rural',
        'Nizamabad',
        'Karimnagar',
        'Khammam',
        'Nalgonda',
        'Mahabubnagar',
        'Adilabad',
        'Mancherial',
        'Nirmal',
        'Peddapalli',
        'Jayashankar',
        'Kamareddy',
        'Siddipet',
        'Jangaon',
        'Medak',
        'Vikarabad',
        'Nagarkurnool',
        'Wanaparthy',
        'Narayanpet',
        'Jogulamba Gadwal',
        'Suryapet',
        'Yadadri Bhuvanagiri',
        'Rajanna Sircilla',
        'Bhadradri Kothagudem',
        'Mahabubabad',
        'Jayashankar Bhupalpally',
        'Mulugu',
        'Komaram Bheem',
        'Other'
    ],
    'Andhra Pradesh': [
        'Visakhapatnam',
        'Vijayawada',
        'Guntur',
        'Tirupati',
        'Nellore',
        'Kurnool',
        'Rajahmundry',
        'Kadapa',
        'Anantapur',
        'Chittoor',
        'Other'
    ],
    'Karnataka': [
        'Bangalore Urban',
        'Bangalore Rural',
        'Mysore',
        'Mangalore',
        'Hubli',
        'Belgaum',
        'Gulbarga',
        'Tumkur',
        'Other'
    ],
    'Tamil Nadu': [
        'Chennai',
        'Coimbatore',
        'Madurai',
        'Salem',
        'Tiruchirappalli',
        'Tiruppur',
        'Vellore',
        'Erode',
        'Other'
    ],
    'Maharashtra': [
        'Mumbai',
        'Pune',
        'Nagpur',
        'Thane',
        'Nashik',
        'Aurangabad',
        'Solapur',
        'Kolhapur',
        'Other'
    ],
    'Default': ['Other']
};

// Helper function to get districts for a state
export const getDistrictsForState = (state) => {
    return districtsByState[state] || districtsByState['Default'];
};
