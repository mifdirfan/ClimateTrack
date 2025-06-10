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
        marginTop: 15,
        marginHorizontal: 10,
        backgroundColor: '#F5F6FA',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 40,
        elevation: 2,
        zIndex: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
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
    newsSection: {
        position: 'absolute',
        bottom: 70,
        left: 0,
        right: 0,
        paddingHorizontal: 15,
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        elevation: 10,
        minHeight: 120,
        maxHeight: 200,
    },
    newsItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        paddingBottom: 6,
    },
    newsImage: {
        width: 60,
        height: 45,
        borderRadius: 8,
        marginRight: 10,
    },
    newsTitle: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#222',
        marginBottom: 2,
    },
    newsDesc: {
        fontSize: 13,
        color: '#555',
    },
    newsDate: {
        fontSize: 11,
        color: '#999',
        marginTop: 3,
    },
});

export default styles;
