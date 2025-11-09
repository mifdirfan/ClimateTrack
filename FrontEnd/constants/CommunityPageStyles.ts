import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        position: 'relative',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f3f3',
        borderRadius: 10,
        marginTop: 70,
        marginHorizontal: 16,
        marginBottom: 12,
        paddingHorizontal: 12,
        height: 40,
    },
    searchInput: {
        marginLeft: 8,
        fontSize: 16,
        flex: 1,
        color: '#333',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 90,
    },
    postCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#222',
        shadowOpacity: 0.06,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        padding: 12,
    },
    postInfo: {
        flex: 1,
        marginRight: 12,
    },
    postTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1d1d1d',
        marginBottom: 4,
    },
    postContent: {
        fontSize: 13,
        color: '#444',
        marginBottom: 6,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    metaText: {
        fontSize: 12,
        color: '#888',
        marginLeft: 3,
    },
    postImage: {
        width: 68,
        height: 68,
        borderRadius: 8,
        backgroundColor: '#e0e0e0',
    },
    writeButton: {
        position: 'absolute',
        right: 24,
        bottom: 100,
        backgroundColor: '#000000',
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        shadowColor: '#222',
        shadowOpacity: 0.4,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 5,
    },
    pencilIcon: {
        marginRight: 6,
        color: '#f2f2f2',
    },
    writeText: {
        color: '#f2f2f2',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 1,
    },
    // adjust style ni
    loginPromptContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loginPromptText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    loginButton: {
        backgroundColor: '#007AFF', // A standard blue color
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
