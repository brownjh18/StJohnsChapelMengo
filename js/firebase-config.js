// Firebase Configuration for St Johns Chapel Admin Panel
// Replace the following config with your own Firebase project config
// Get your config from: Firebase Console > Project Settings > Your Apps > SDK setup

const firebaseAppConfig = {
    apiKey: "AIzaSyAE5FGdHaa3lASNFUB8lkKBv5ScVUQhfn0",
    authDomain: "stjohns-d1969.firebaseapp.com",
    databaseURL: "https://stjohns-d1969-default-rtdb.firebaseio.com",
    projectId: "stjohns-d1969",
    storageBucket: "stjohns-d1969.firebasestorage.app",
    messagingSenderId: "849163862020",
    appId: "1:849163862020:web:f5a69f6b634e6ab5d0b551",
    measurementId: "G-F55YXF3Y86"
};

// Initialize Firebase
let app = null;
let database = null;
let firebaseInitialized = false;

// Check if Firebase config is valid (not placeholder values)
function isFirebaseConfigured() {
    return firebaseAppConfig.apiKey !== "YOUR_API_KEY" &&
           firebaseAppConfig.projectId !== "YOUR_PROJECT_ID" &&
           firebaseAppConfig.databaseURL !== "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com";
}

// Initialize Firebase
function initializeFirebase() {
    if (!isFirebaseConfigured()) {
        console.warn('Firebase is not configured. Using localStorage as fallback.');
        console.info('To enable Firebase:');
        console.info('1. Go to https://console.firebase.google.com/');
        console.info('2. Create a new project or use existing one');
        console.info('3. Enable Realtime Database in the project');
        console.info('4. Go to Project Settings > General > Your Apps');
        console.info('5. Add a web app and copy the config to js/firebase-config.js');
        console.info('6. Set up database rules for read/write access');
        return false;
    }

    try {
        app = firebase.initializeApp(firebaseAppConfig);
        database = firebase.database();
        firebaseInitialized = true;
        console.log('Firebase initialized successfully');
        return true;
    } catch (error) {
        console.error('Firebase initialization error:', error);
        return false;
    }
}

// ============================================
// SERMONS CRUD OPERATIONS
// ============================================

// Get all sermons
async function getSermons() {
    if (firebaseInitialized && database) {
        try {
            const snapshot = await database.ref('sermons').once('value');
            const data = snapshot.val();
            // Convert object to array and sort by createdAt (newest first)
            if (data) {
                return Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }
            return [];
        } catch (error) {
            console.error('Error fetching sermons from Firebase:', error);
            // Fallback to localStorage
            return JSON.parse(localStorage.getItem('sermons') || '[]');
        }
    } else {
        // Fallback to localStorage
        return JSON.parse(localStorage.getItem('sermons') || '[]');
    }
}

// Add a new sermon
async function addSermon(sermon) {
    if (firebaseInitialized && database) {
        try {
            const newSermonRef = database.ref('sermons').push();
            const sermonWithId = {
                ...sermon,
                id: newSermonRef.key,
                createdAt: new Date().toISOString()
            };
            await newSermonRef.set(sermonWithId);
            console.log('Sermon added to Firebase:', sermonWithId.id);
            return { success: true, sermon: sermonWithId };
        } catch (error) {
            console.error('Error adding sermon to Firebase:', error);
            return { success: false, error: error.message };
        }
    } else {
        // Fallback to localStorage
        const sermons = JSON.parse(localStorage.getItem('sermons') || '[]');
        sermon.id = Date.now().toString();
        sermon.createdAt = new Date().toISOString();
        sermons.unshift(sermon);
        localStorage.setItem('sermons', JSON.stringify(sermons));
        return { success: true, sermon: sermon };
    }
}

// Update a sermon
async function updateSermon(id, updatedData) {
    if (firebaseInitialized && database) {
        try {
            await database.ref(`sermons/${id}`).update({
                ...updatedData,
                updatedAt: new Date().toISOString()
            });
            console.log('Sermon updated in Firebase:', id);
            return { success: true };
        } catch (error) {
            console.error('Error updating sermon in Firebase:', error);
            return { success: false, error: error.message };
        }
    } else {
        // Fallback to localStorage
        let sermons = JSON.parse(localStorage.getItem('sermons') || '[]');
        const index = sermons.findIndex(s => s.id === id);
        if (index !== -1) {
            sermons[index] = { ...sermons[index], ...updatedData, updatedAt: new Date().toISOString() };
            localStorage.setItem('sermons', JSON.stringify(sermons));
            return { success: true };
        }
        return { success: false, error: 'Sermon not found' };
    }
}

// Delete a sermon
async function deleteSermon(id) {
    if (firebaseInitialized && database) {
        try {
            await database.ref(`sermons/${id}`).remove();
            console.log('Sermon deleted from Firebase:', id);
            return { success: true };
        } catch (error) {
            console.error('Error deleting sermon from Firebase:', error);
            return { success: false, error: error.message };
        }
    } else {
        // Fallback to localStorage
        let sermons = JSON.parse(localStorage.getItem('sermons') || '[]');
        sermons = sermons.filter(s => s.id !== id);
        localStorage.setItem('sermons', JSON.stringify(sermons));
        return { success: true };
    }
}

// Clear all sermons
async function clearAllSermons() {
    if (firebaseInitialized && database) {
        try {
            await database.ref('sermons').remove();
            console.log('All sermons cleared from Firebase');
            return { success: true };
        } catch (error) {
            console.error('Error clearing sermons from Firebase:', error);
            return { success: false, error: error.message };
        }
    } else {
        localStorage.removeItem('sermons');
        return { success: true };
    }
}

// ============================================
// EVENTS CRUD OPERATIONS
// ============================================

// Get all events
async function getEvents() {
    if (firebaseInitialized && database) {
        try {
            const snapshot = await database.ref('events').once('value');
            const data = snapshot.val();
            if (data) {
                return Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                })).sort((a, b) => new Date(a.date) - new Date(b.date));
            }
            return [];
        } catch (error) {
            console.error('Error fetching events from Firebase:', error);
            return JSON.parse(localStorage.getItem('events') || '[]');
        }
    } else {
        return JSON.parse(localStorage.getItem('events') || '[]');
    }
}

// Add a new event
async function addEvent(event) {
    if (firebaseInitialized && database) {
        try {
            const newEventRef = database.ref('events').push();
            const eventWithId = {
                ...event,
                id: newEventRef.key,
                createdAt: new Date().toISOString()
            };
            await newEventRef.set(eventWithId);
            console.log('Event added to Firebase:', eventWithId.id);
            return { success: true, event: eventWithId };
        } catch (error) {
            console.error('Error adding event to Firebase:', error);
            return { success: false, error: error.message };
        }
    } else {
        const events = JSON.parse(localStorage.getItem('events') || '[]');
        event.id = Date.now().toString();
        event.createdAt = new Date().toISOString();
        events.push(event);
        localStorage.setItem('events', JSON.stringify(events));
        return { success: true, event: event };
    }
}

// Update an event
async function updateEvent(id, updatedData) {
    if (firebaseInitialized && database) {
        try {
            await database.ref(`events/${id}`).update({
                ...updatedData,
                updatedAt: new Date().toISOString()
            });
            console.log('Event updated in Firebase:', id);
            return { success: true };
        } catch (error) {
            console.error('Error updating event in Firebase:', error);
            return { success: false, error: error.message };
        }
    } else {
        let events = JSON.parse(localStorage.getItem('events') || '[]');
        const index = events.findIndex(e => e.id === id);
        if (index !== -1) {
            events[index] = { ...events[index], ...updatedData, updatedAt: new Date().toISOString() };
            localStorage.setItem('events', JSON.stringify(events));
            return { success: true };
        }
        return { success: false, error: 'Event not found' };
    }
}

// Delete an event
async function deleteEvent(id) {
    if (firebaseInitialized && database) {
        try {
            await database.ref(`events/${id}`).remove();
            console.log('Event deleted from Firebase:', id);
            return { success: true };
        } catch (error) {
            console.error('Error deleting event from Firebase:', error);
            return { success: false, error: error.message };
        }
    } else {
        let events = JSON.parse(localStorage.getItem('events') || '[]');
        events = events.filter(e => e.id !== id);
        localStorage.setItem('events', JSON.stringify(events));
        return { success: true };
    }
}

// ============================================
// SITE METADATA OPERATIONS
// ============================================

// Get site metadata
async function getSiteMetadata() {
    if (firebaseInitialized && database) {
        try {
            const snapshot = await database.ref('metadata').once('value');
            return snapshot.val() || getDefaultMetadata();
        } catch (error) {
            console.error('Error fetching metadata from Firebase:', error);
            return JSON.parse(localStorage.getItem('siteMetadata') || JSON.stringify(getDefaultMetadata()));
        }
    } else {
        return JSON.parse(localStorage.getItem('siteMetadata') || JSON.stringify(getDefaultMetadata()));
    }
}

// Update site metadata
async function updateSiteMetadata(metadata) {
    if (firebaseInitialized && database) {
        try {
            await database.ref('metadata').update({
                ...metadata,
                updatedAt: new Date().toISOString()
            });
            console.log('Metadata updated in Firebase');
            return { success: true };
        } catch (error) {
            console.error('Error updating metadata in Firebase:', error);
            return { success: false, error: error.message };
        }
    } else {
        localStorage.setItem('siteMetadata', JSON.stringify({
            ...metadata,
            updatedAt: new Date().toISOString()
        }));
        return { success: true };
    }
}

// Default metadata structure
function getDefaultMetadata() {
    return {
        siteName: "St Johns Chapel, Mengo",
        tagline: "A Place of Worship, Fellowship & Growth",
        address: "Mengo, Kampala, Uganda",
        phone: "+256 414 123 456",
        email: "info@stjohnschapelmengo.org",
        youtubeChannel: "https://youtube.com/@st.johnschapelmengo",
        socialLinks: {
            facebook: "#",
            youtube: "https://youtube.com/@st.johnschapelmengo",
            instagram: "#",
            twitter: "#"
        },
        serviceTimes: {
            sundayService: "8:00 AM & 10:30 AM",
            bibleStudy: "Wednesday 6:00 PM",
            eveningService: "Sunday 6:00 PM",
            sundaySchool: "Sunday 9:00 AM"
        },
        pastorName: "Rev. Canon. James Ssempala",
        pastorTitle: "Senior Pastor"
    };
}

// ============================================
// REAL-TIME LISTENERS
// ============================================

// Listen for sermon changes
function listenForSermonChanges(callback) {
    if (firebaseInitialized && database) {
        database.ref('sermons').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const sermons = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                callback(sermons);
            } else {
                callback([]);
            }
        });
    }
}

// Listen for event changes
function listenForEventChanges(callback) {
    if (firebaseInitialized && database) {
        database.ref('events').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const events = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                })).sort((a, b) => new Date(a.date) - new Date(b.date));
                callback(events);
            } else {
                callback([]);
            }
        });
    }
}

// ============================================
// DATA MIGRATION
// ============================================

// Migrate localStorage data to Firebase
async function migrateLocalStorageToFirebase() {
    if (!firebaseInitialized || !database) {
        console.warn('Firebase not initialized. Cannot migrate data.');
        return { success: false, error: 'Firebase not initialized' };
    }

    try {
        // Migrate sermons
        const sermons = JSON.parse(localStorage.getItem('sermons') || '[]');
        if (sermons.length > 0) {
            const sermonsRef = database.ref('sermons');
            const sermonsObj = {};
            sermons.forEach(sermon => {
                sermonsObj[sermon.id] = sermon;
            });
            await sermonsRef.set(sermonsObj);
            console.log(`Migrated ${sermons.length} sermons to Firebase`);
        }

        // Migrate events
        const events = JSON.parse(localStorage.getItem('events') || '[]');
        if (events.length > 0) {
            const eventsRef = database.ref('events');
            const eventsObj = {};
            events.forEach(event => {
                eventsObj[event.id] = event;
            });
            await eventsRef.set(eventsObj);
            console.log(`Migrated ${events.length} events to Firebase`);
        }

        // Migrate metadata
        const metadata = JSON.parse(localStorage.getItem('siteMetadata') || JSON.stringify(getDefaultMetadata()));
        await database.ref('metadata').set(metadata);
        console.log('Migrated site metadata to Firebase');

        return { success: true };
    } catch (error) {
        console.error('Error migrating data to Firebase:', error);
        return { success: false, error: error.message };
    }
}

// Export functions for use in other files
window.firebaseConfig = {
    isConfigured: isFirebaseConfigured,
    initialize: initializeFirebase,
    isInitialized: () => firebaseInitialized,
    
    // Sermons
    getSermons,
    addSermon,
    updateSermon,
    deleteSermon,
    clearAllSermons,
    
    // Events
    getEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    
    // Metadata
    getSiteMetadata,
    updateSiteMetadata,
    getDefaultMetadata,
    
    // Real-time listeners
    listenForSermonChanges,
    listenForEventChanges,
    
    // Migration
    migrateLocalStorageToFirebase
};
