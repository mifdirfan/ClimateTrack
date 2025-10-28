import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute', // Position it over the map
        top: 10,
        left: 10,
        right: 10,
        backgroundColor: '#F5F6FA',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 40,
        elevation: 2,
        zIndex: 10, // Make sure it's on top of the map and other controls
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    filterContainer: {
        position: 'absolute',
        top: 60, // Position it below the search bar
        left: 10,
        flexDirection: 'row',
        zIndex: 10,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1.5,
    },
    filterButtonActive: {
        borderColor: '#007AFF',
        backgroundColor: '#007AFF',
    },
    filterButtonInactive: {
        borderColor: '#B0B0B0',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    filterButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 14,
        marginTop: 5,
        marginBottom: 5,
    },
    filterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 6,
        marginRight: 8,
    },
    filterBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
    },
    filterMoreBtn: {
        backgroundColor: '#F5F6FA',
        borderRadius: 8,
        padding: 7,
        paddingBottom: 5,
        marginLeft: 2,
    },
    map: {
        flex: 1.3,
        width: '100%',
        minHeight: 220,
    },
    marker: {
        borderRadius: 999,
        padding: 7,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#fff',
        borderWidth: 2,
    },
    webviewCloseBtn: {
        padding: 16,
        backgroundColor: '#fff',
        zIndex: 1,
        alignItems: 'flex-end',
    },

    webviewCloseText: {
        color: '#222',
        fontWeight: '500',
        marginTop: 35,
        fontSize: 20,
    },
});

export default styles;
