import React from 'react';

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
    // const [theme, setTheme] = useState<string | null>(null);
    // const [components, setComponents] = useState<any>(null);

    // useEffect(() => {
    //     // Fetch the theme from the server
    //     fetch(`/api/theme?username=${params.username}`)
    //         .then(response => response.json())
    //         .then(data => {
    //             setTheme(data.theme);
    //         });
    // }, [params.username]);

    // useEffect(() => {
    //     if (theme) {
    //         // Dynamically import components based on the theme
    //         import(`@/components/${theme}`).then(setComponents);
    //     }
    // }, [theme]);

    // if (!components) {
    //     return <div>Loading...</div>;
    // }

    // const { HeroCard, NavLinks, Overview, SkillSection } = components;

    return (
        <div className="flex flex-col gap-3 lg:grid grid-cols-3">
            {/* <div className="flex flex-col gap-3">
                <HeroCard />
                <SkillSection />
            </div>
            <div className="lg:col-span-2">
                <NavLinks />
                <Overview />
            </div> */}
            hi {(await params).username}
        </div>
    );
}