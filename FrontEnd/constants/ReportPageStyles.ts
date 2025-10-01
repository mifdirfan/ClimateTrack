import { StyleSheet } from 'react-native';

// -------- styles --------
const HEADER_HEIGHT = 52;

export const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#FFF',
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
        paddingTop: HEADER_HEIGHT + 18, // offset for sticky header
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
        gap: 8,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: '700',
        paddingHorizontal: 16,
        marginBottom: 6,
    },

    label: {
        fontSize: 14,
        fontWeight: '600',
        marginHorizontal: 16,
        marginBottom: 6,
    },

    input: {
        backgroundColor: '#EDEDED',
        height: 40,
        borderRadius: 10,
        paddingHorizontal: 14,
        fontSize: 15,
        marginHorizontal: 16,
        marginBottom: 8,
    },
    textArea: {
        height: 72,
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

    // Image picker
    imagePicker: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EDEDED',
        borderRadius: 10,
        height: 110,
        marginHorizontal: 16,
        marginBottom: 10,
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
        backgroundColor: '#59a2fd',
        borderRadius: 10,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 6,
        marginBottom: 6,
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
        fontSize: 24,
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
        fontSize: 20,
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
        marginHorizontal: 26,
        marginBottom: 25,
    },
    locationInput: {
        flex: 1,
        height: 50,
        backgroundColor: "#F0F0F0",
        paddingHorizontal: 15,
        fontSize: 16,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    findButton: {
        height: 50,
        backgroundColor: '#007AFF',
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
});