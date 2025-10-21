import { StyleSheet } from 'react-native';

// -------- styles --------
const HEADER_HEIGHT = 52;

export const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        position: 'relative',
    },

    // Sticky header
    headerRow: {
        position: 'absolute',
        top: 45,
        left: 0,
        right: 0,
        height: HEADER_HEIGHT,
        backgroundColor: '#FFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E5E5E5',
        zIndex: 10,
        elevation: 4, // Android
    },
    headerTitle: { fontSize: 24, fontWeight: '700' },

    // Body (no scroll; sized to fit one page)
    pageBody: {
        flex: 1,
        paddingTop: 5, // offset for sticky header
        paddingBottom: 10,
        paddingLeft: 18,
        paddingRight: 18,
        gap: 10,
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: '700',
        paddingHorizontal: 16,
        marginBottom: 20,
    },

    label: {
        color: "#000000",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 9,
        paddingHorizontal: 18,
    },

    input: {
        backgroundColor: '#EDEDED',
        height: 40,
        borderRadius: 10,
        paddingHorizontal: 14,
        fontSize: 15,
        marginHorizontal: 16,
        marginBottom: 15,
    },
    textArea: {
        height:120,
        textAlignVertical: 'top',
        paddingTop: 10,
    },

    // Chips
    disasterTypeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingHorizontal: 8,
        marginBottom: 10,
    },
    disasterTypeButton: {
        backgroundColor: '#EFEFEF',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 18,
        marginHorizontal: 4,
        marginVertical: 4,
    },
    disasterTypeButtonSelected: { backgroundColor: '#007AFF' },
    disasterTypeText: { color: '#333', fontWeight: '600', fontSize: 14 },
    disasterTypeTextSelected: { color: '#FFF' },

    // Dropdown styles
    dropdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#EDEDED',
        height: 40,
        borderRadius: 10,
        paddingHorizontal: 14,
        marginHorizontal: 16,
        marginBottom: 8,
    },
    dropdownText: {
        fontSize: 15,
        color: '#333',
    },
    dropdownPlaceholder: {
        fontSize: 15,
        color: '#9B9B9B',
    },

    // Modal styles
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 10,
        width: '80%',
        maxHeight: '60%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalItem: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    modalItemText: {
        fontSize: 16,
        color: '#333',
    },
    modalItemSelectedText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: 'bold',
    },

    // Image picker
    imagePicker: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EDEDED',
        borderRadius: 10,
        height: 180,
        marginHorizontal: 16,
        marginBottom: 15,
        overflow: 'hidden',
    },
    imagePreview: { width: '100%', height: '100%', borderRadius: 10 },
    plusWrap: { alignItems: 'center', justifyContent: 'center' },
    plusCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1.5,
        borderColor: '#8C8C8C',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Submit button
    submitButton: {
        backgroundColor: '#000000',
        borderRadius: 10,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 6,
        marginBottom: 100,
    },
    submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
    image3: {
        height: 77,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 9,
        paddingHorizontal: 16,
    },
    scrollView: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    text: {
        color: "#000000",
        fontSize: 28,
        fontWeight: "bold",
    },
    text2: {
        color: "#000000",
        fontSize: 28,
        fontWeight: "bold",
        marginLeft: 26,
        width: 229,
    },
    text3: {
        color: "#000000",
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 13,
        marginLeft: 36,
    },
    text4: {
        color: "#000000",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 9,
        marginLeft: 39,
    },
    text5: {
        color: "#000000",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 9,
        marginLeft: 37,
    },
    // geo style
    locationInputContainer: {
        flexDirection: 'row',
        paddingHorizontal: 14,
        marginHorizontal: 4,
        marginBottom: 15,
    },
    locationInput: {
        flex: 1,
        height: 40,
        backgroundColor: "#F0F0F0",
        paddingHorizontal: 15,
        fontSize: 16,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    findButton: {
        height: 40,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    findButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
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
    // findButtonText: {
    //     color: '#FFFFFF',
    //     fontWeight: 'bold',
    // },
});