import { StyleSheet } from 'react-native';

export const TAB_LABELS = ['Community', 'News', 'Notifications'];

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    tabRow: {
        flexDirection: 'row',
        marginTop: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
    },
    tabBtn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        position: 'relative',
    },
    tabLabel: {
        color: '#888',
        fontSize: 16,
        fontWeight: '500',
        paddingBottom: 4,
    },
    activeTabLabel: {
        color: '#222',
        fontWeight: '700',
    },
    underline: {
        position: 'absolute',
        bottom: 0,
        left: '25%',
        right: '25%',
        height: 3,
        backgroundColor: '#222',
        borderRadius: 2,
    },
    tabContent: {
        flex: 1,
        backgroundColor: '#fff',
    },
    newsTabWrapper: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerImage: {
        height: 44,
    },
    headerRow: {
        top: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 9,
        paddingHorizontal: 16,
        marginBottom: 26,
    },
    headerTitle: {
        color: '#000000',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        position: 'absolute', // Position it relative to the parent
        left: 0,              // Span the full width of the parent
        right: 0,             // Span the full width of the parent
        zIndex: -1,
    },
    newsListContainer: {
        paddingHorizontal: 18,
    },
    newsItem: {
        borderRadius: 16,
        backgroundColor: '#fff',
        marginVertical: 15,
        marginHorizontal: 2,
        elevation: 2,
        overflow: 'hidden',
        minHeight: 350,
    },
    newsImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
    },
    newsContent: {
        padding: 12,
    },
    newsSource: {
        fontSize: 15,
        color: '#555',
        marginBottom: 2,
    },
    newsTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 6,
    },
    newsDesc: {
        fontSize: 15,
        color: '#444',
        marginBottom: 10,
    },
    newsMeta: {
        fontSize: 13,
        color: '#888',
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
