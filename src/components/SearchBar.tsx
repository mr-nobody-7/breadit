"use client";

import { useQuery } from "@tanstack/react-query";
import { Command, CommandInput, CommandItem, CommandList } from "./ui/Command";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Prisma, Subreddit } from "@prisma/client";
import { CommandEmpty, CommandGroup } from "./ui/Command";
import { usePathname, useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import debounce from "lodash.debounce";

const SearchBar = () => {
  const [input, setInput] = useState<string>("");
  const router = useRouter();
  const pathname = usePathname()
  const commandRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(commandRef, () => {
    setInput('')
  })

  const request = debounce(async () => {
    refetch()
  }, 300)

  const debounceRequest = useCallback(() => {
    request()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const {
    data: queryResults,
    refetch,
    isFetched,
    isFetching,
  } = useQuery({
    queryFn: async () => {
      if (!input) return [];
      const { data } = await axios.get(`/api/search?q=${input}`);
      return data as (Subreddit & {
        _count: Prisma.SubredditCountOutputType;
      })[];
    },
    queryKey: ["search query"],
    enabled: false,
  });

  useEffect(() => {
    setInput('')
  }, [pathname])


  return (
    <Command className="relative rounded-lg border max-w-lg z-50 overflow-visible">
      <CommandInput
        value={input}
        onValueChange={(text) => {
          setInput(text);
          debounceRequest()
        }}
        placeholder="search communities"
        className="outline-none border-none hover:outline-none hover:border-none"
      />

      {input.length> 0 ? (
        <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
          {isFetched && <CommandEmpty>No results Found.</CommandEmpty>}
          {(queryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading="Communities">
              {queryResults?.map((subreddit) => (
                <CommandItem 
                  onSelect={(e) => {
                    router.push(`/r/${e}`)
                    router.refresh()
                  }}
                  key={subreddit.id}
                  value={subreddit.name}
                >
                  <Users className='mr-2 h-4 w-4' />
                  <a href={`/r/${subreddit.name}`}>r/{subreddit.name}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      ) : null}
    </Command>
  );
};

export default SearchBar;
