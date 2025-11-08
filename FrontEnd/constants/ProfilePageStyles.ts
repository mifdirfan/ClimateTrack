import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
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
        marginTop: 38,
        marginBottom: 8,
        paddingHorizontal: 27,
    },
    profileAvatar: {
        width: 85,
        height: 85,
        marginRight: 19,
        borderRadius: 42, // Make it a circle
    },
    profileTextContainer: {
        flex: 1,
        justifyContent: 'center', // Vertically center the text content
        paddingLeft: 10 // Use paddingLeft instead of generic padding
    },
    profileUsername: {
        color: '#000000',
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    profileFullName: {
        color: '#000000',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    profileEmail: {
        color: '#767676',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    // Reports Section
    reportsHeader: {
        color: '#000000',
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 12,
        paddingHorizontal: 27,
        paddingTop: 40
    },
    reportsContainer: {
        // Use paddingHorizontal for the first and last item's spacing
        paddingHorizontal: 27,
        marginBottom: 13,
        borderRadius: 10,
        borderColor: '#DFDFDF',
        backgroundColor: '#FFFFFF'
    },
    reportCard: {
        backgroundColor: '#FFFFFF',
        borderColor: '#DFDFDF',
        borderRadius: 8,
        borderWidth: 1,
        padding: 16,
        // Give each card a defined width to work in a horizontal scroll
        width: 260,
        minHeight: 180,
        // Add margin to the right for spacing between cards
        marginRight: 12,
    },
    reportLocation: {
        fontSize: 10,
        color: '#666',
        fontWeight: '600',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    reportImage: {
        borderRadius: 8,
        height: 133,
        width: '100%',
    },
    reportDate: {
        color: '#000000',
        fontSize: 9,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    reportTitle: {
        color: '#000000',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    reportDescription: {
        color: '#000000',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 8,
    },

    // Settings Section
    settingsContainer: {
        top: 20,
        paddingHorizontal: 16,
        marginBottom: 60,
        marginLeft: 10,
    },
    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },
    settingsIcon: {
        width: 30,
        height: 30,
        marginRight: 20,
    },
    settingsText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: "600",
    },
    // Footer
    footerImage: {
        height: 77,
    },
    logoutButton: {
        padding: 0,
        margin: 0,
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#DD0000',
        borderRadius: 8,
        paddingVertical: 12,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    logoutText: {
        paddingLeft: 10,
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Modal Styles for Report Details
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
    },
    modalImage: {
        width: '100%',
        height: 200,
        minHeight: 200,
        borderRadius: 8,
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    modalMeta: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    modalDescription: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
        maxHeight: 60,
        marginBottom: 10,
    },
    modalCloseButton: {
        flex: 1, // Make button flexible
        marginRight: 5, // Add space between buttons
        backgroundColor: '#000000',
        borderRadius: 8,
        paddingVertical: 12,
    },
    closeButton: {
        backgroundColor: '#000000',
        borderRadius: 8,
        paddingVertical: 12,
        marginTop: 10,
    },
    closeButtonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },

    // Styles for text content within a setting modal
    modalSectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    modalParagraph: {
        fontSize: 15,
        lineHeight: 22,
        color: '#555',
    },

    // Styles for options within a setting modal
    settingOptionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        marginVertical: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#EEE',
    },
    settingOptionText: {
        fontSize: 16,
        color: '#333',
    },
    loginPromptContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loginPromptText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    loginButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteReportButton: {
        marginLeft: 5, // Add space between buttons
        maxWidth: 70,
        flex: 1, // Make button flexible
        backgroundColor: '#DD0000',
        borderRadius: 8,
        paddingVertical: 12,
    },
    deleteReportButtonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});