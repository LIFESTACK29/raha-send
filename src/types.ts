import RBSheet from "react-native-raw-bottom-sheet";

export enum COLOR_SCHEME {
    dark = "dark",
    light = "light",
}

export type Nav = {
    navigate: (value: string, objectValue?: any) => void;
    goBack: any;
    getParam: (valueOne?: string, valueTwo?: string) => void;
};

export type RBSheetRef = typeof RBSheet extends React.ComponentType<infer P>
    ? P extends { ref?: React.Ref<infer R>; current: any }
        ? R
        : never
    : never;
