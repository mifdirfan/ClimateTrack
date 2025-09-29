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
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 9,
        paddingHorizontal: 16,
        marginBottom: 26,
    },
    headerIcon: {
        width: 24,
        height: 24,
    },
    headerTitle: {
        color: '#000000',
        fontSize: 24,
        fontWeight: 'bold',
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
    },
    profileName: {
        color: '#000000',
        fontSize: 20,
        fontWeight: 'bold',
    },
    profileLocation: {
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
    },
    reportsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 21,
        marginBottom: 26,
    },
    reportCard: {
        backgroundColor: '#FFFFFF',
        borderColor: '#DFDFDF',
        borderRadius: 8,
        borderWidth: 1,
        padding: 16,
        flex: 1,
    },
    reportCardMargin: {
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
});