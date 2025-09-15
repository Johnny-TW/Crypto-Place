interface DialogProviderProps {
  [key: string]: any;
}

function DialogProvider(props: DialogProviderProps) {
  return (
    <div>
      <div {...props} />
    </div>
  );
}

export default DialogProvider;
