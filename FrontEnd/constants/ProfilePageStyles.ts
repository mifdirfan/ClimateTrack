import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingLeft: 10
    },
    listContainer: {
        paddingBottom: 20,
    },
    // Header Section
    headerImage: {
        height: 44,
    },
    headerIcon: {
        width: 24,
        height: 24,
    },
    headerTitle: {
        color: '#000000',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        position: 'absolute', // Position it relative to the parent
        left: 0,              // Span the full width of the parent
        right: 0,             // Span the full width of the parent
        zIndex: -1
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 9,
        paddingHorizontal: 16,
        marginTop: 10,
        marginBottom: 16, // Adjusted for consistency
    },
    // Profile Info Section
    profileInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 38,
        paddingHorizontal: 27,
    },
    profileAvatar: {
        width: 84,
        height: 85,
        marginRight: 19,
        borderRadius: 42, // Make it a circle
    },
    profileTextContainer: {
        flex: 1,
        justifyContent: 'center', // Vertically center the text content
        paddingLeft: 10 // Use paddingLeft instead of generic padding
    },
    profileName: {
        color: '#000000',
        fontSize: 24,
        fontWeight: 'bold',
    },
    profileLocation: {
        color: '#767676',
        fontSize: 18,
        fontWeight: 'bold',
    },
    profileEmail: {
        color: '#767676',
        fontSize: 14,
        fontWeight: 'bold',
    },
    // Reports Section
    reportsHeader: {
        color: '#000000',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
        paddingHorizontal: 27,
        paddingTop: 50
    },
    reportsContainer: {
        // Use paddingHorizontal for the first and last item's spacing
        paddingHorizontal: 27,
        marginBottom: 26,
        borderWidth: 20,
        borderRadius: 10,
        borderColor: '#000000',
        backgroundColor: '#000000'
    },
    reportCard: {
        backgroundColor: '#FFFFFF',
        borderColor: '#DFDFDF',
        borderRadius: 8,
        borderWidth: 1,
        padding: 16,
        // Give each card a defined width to work in a horizontal scroll
        width: 220,
        // Add margin to the right for spacing between cards
        marginRight: 12,
    },
    reportText: {
        color: '#000000',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    reportImage: {
        borderRadius: 8,
        height: 133,
        width: '100%',
    },
    // Settings Section
    settingsContainer: {
        top: 180,
        paddingHorizontal: 16,
    },
    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 26,
    },
    settingsIcon: {
        width: 34,
        height: 34,
        marginRight: 12,
    },
    settingsText: {
        color: '#000000',
        fontSize: 15,
        fontWeight: 'bold',
    },
    // Footer
    footerImage: {
        height: 77,
    },
    logoutButton: {
        padding: 0
    },

});