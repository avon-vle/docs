import { DocsNavigationProvider } from "./context/DocsNavigationContext";
import { DocsThemeProvider } from "./context/DocsThemeContext";
import { useDocsPath } from "./hooks/useDocsPath";
import { DocsPage } from "./pages/DocsPage";

export const App = () => {
  const navigation = useDocsPath();

  return (
    <DocsThemeProvider>
      <DocsNavigationProvider value={navigation}>
        <DocsPage key={navigation.route.slug} slug={navigation.route.slug} />
      </DocsNavigationProvider>
    </DocsThemeProvider>
  );
};
